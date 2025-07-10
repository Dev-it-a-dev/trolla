import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import type { DatabaseBoard, DatabaseList, DatabaseCard } from '@/lib/supabase'

export interface Card {
  id: string
  title: string
  description?: string
  listId: string
  order: number
  createdAt: Date
}

export interface List {
  id: string
  title: string
  boardId: string
  order: number
  cards: Card[]
}

export interface Board {
  id: string
  title: string
  description?: string
  createdAt: Date
  lists: List[]
}

export const useBoardStore = defineStore('board', () => {
  const boards = ref<Board[]>([])
  const currentBoardId = ref<string | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Load data from Supabase on initialization
  const loadFromDatabase = async () => {
    loading.value = true
    error.value = null
    
    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }
    
    try {
      // Load boards
      const { data: boardsData, error: boardsError } = await supabase
        .from('boards')
        .select('*')
        .order('created_at', { ascending: false })

      if (boardsError) throw boardsError

      // Load lists for each board
      const { data: listsData, error: listsError } = await supabase
        .from('lists')
        .select('*')
        .order('order', { ascending: true })

      if (listsError) throw listsError

      // Load cards for each list
      const { data: cardsData, error: cardsError } = await supabase
        .from('cards')
        .select('*')
        .order('order', { ascending: true })

      if (cardsError) throw cardsError

      // Transform data to match our interface
      const transformedBoards: Board[] = (boardsData || []).map((dbBoard: DatabaseBoard) => {
        const boardLists = (listsData || [])
          .filter((dbList: DatabaseList) => dbList.board_id === dbBoard.id)
          .map((dbList: DatabaseList) => {
            const listCards = (cardsData || [])
              .filter((dbCard: DatabaseCard) => dbCard.list_id === dbList.id)
              .map((dbCard: DatabaseCard) => ({
                id: dbCard.id,
                title: dbCard.title,
                description: dbCard.description,
                listId: dbCard.list_id,
                order: dbCard.order,
                createdAt: new Date(dbCard.created_at)
              }))

            return {
              id: dbList.id,
              title: dbList.title,
              boardId: dbList.board_id,
              order: dbList.order,
              cards: listCards
            }
          })

        return {
          id: dbBoard.id,
          title: dbBoard.title,
          description: dbBoard.description,
          createdAt: new Date(dbBoard.created_at),
          lists: boardLists
        }
      })

      boards.value = transformedBoards

      // Set current board if none is selected
      if (!currentBoardId.value && boards.value.length > 0) {
        currentBoardId.value = boards.value[0].id
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to load data'
      console.error('Error loading data:', err)
    } finally {
      loading.value = false
    }
  }

  // Initialize store
  loadFromDatabase()

  // Computed properties
  const currentBoard = computed(() => {
    return boards.value.find(board => board.id === currentBoardId.value) || null
  })

  const sortedLists = computed(() => {
    if (!currentBoard.value) return []
    return [...currentBoard.value.lists].sort((a, b) => a.order - b.order)
  })

  // Actions
  const createBoard = async (title: string, description?: string) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { data, error: createError } = await supabase
        .from('boards')
        .insert({
          title,
          description
        })
        .select()
        .single()

      if (createError) throw createError

      const newBoard: Board = {
        id: data.id,
        title: data.title,
        description: data.description,
        createdAt: new Date(data.created_at),
        lists: []
      }

      boards.value.unshift(newBoard)
      currentBoardId.value = newBoard.id

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create board'
      console.error('Error creating board:', err)
    } finally {
      loading.value = false
    }
  }

  const updateBoard = async (boardId: string, updates: Partial<Board>) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('boards')
        .update({
          title: updates.title,
          description: updates.description
        })
        .eq('id', boardId)

      if (updateError) throw updateError

      const board = boards.value.find(b => b.id === boardId)
      if (board) {
        Object.assign(board, updates)
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update board'
      console.error('Error updating board:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteBoard = async (boardId: string) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('boards')
        .delete()
        .eq('id', boardId)

      if (deleteError) throw deleteError

      const index = boards.value.findIndex(b => b.id === boardId)
      if (index !== -1) {
        boards.value.splice(index, 1)
        if (currentBoardId.value === boardId) {
          currentBoardId.value = boards.value.length > 0 ? boards.value[0].id : null
        }
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete board'
      console.error('Error deleting board:', err)
    } finally {
      loading.value = false
    }
  }

  const setCurrentBoard = (boardId: string) => {
    currentBoardId.value = boardId
  }

  const createList = async (title: string, boardId?: string) => {
    const targetBoardId = boardId || currentBoardId.value
    if (!targetBoardId) return null

    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const board = boards.value.find(b => b.id === targetBoardId)
      if (!board) throw new Error('Board not found')

      const { data, error: createError } = await supabase
        .from('lists')
        .insert({
          title,
          board_id: targetBoardId,
          order: board.lists.length
        })
        .select()
        .single()

      if (createError) throw createError

      const newList: List = {
        id: data.id,
        title: data.title,
        boardId: data.board_id,
        order: data.order,
        cards: []
      }

      board.lists.push(newList)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create list'
      console.error('Error creating list:', err)
    } finally {
      loading.value = false
    }
  }

  const updateList = async (listId: string, updates: Partial<List>) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('lists')
        .update({
          title: updates.title
        })
        .eq('id', listId)

      if (updateError) throw updateError

      const board = boards.value.find(b => b.lists.some(l => l.id === listId))
      if (board) {
        const list = board.lists.find(l => l.id === listId)
        if (list) {
          Object.assign(list, updates)
        }
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update list'
      console.error('Error updating list:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteList = async (listId: string) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('lists')
        .delete()
        .eq('id', listId)

      if (deleteError) throw deleteError

      const board = boards.value.find(b => b.lists.some(l => l.id === listId))
      if (board) {
        const index = board.lists.findIndex(l => l.id === listId)
        if (index !== -1) {
          board.lists.splice(index, 1)
          // Reorder remaining lists
          board.lists.forEach((list, i) => {
            list.order = i
          })
        }
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete list'
      console.error('Error deleting list:', err)
    } finally {
      loading.value = false
    }
  }

  const createCard = async (title: string, listId: string, description?: string) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const list = boards.value
        .flatMap(b => b.lists)
        .find(l => l.id === listId)

      if (!list) throw new Error('List not found')

      const { data, error: createError } = await supabase
        .from('cards')
        .insert({
          title,
          description,
          list_id: listId,
          order: list.cards.length
        })
        .select()
        .single()

      if (createError) throw createError

      const newCard: Card = {
        id: data.id,
        title: data.title,
        description: data.description,
        listId: data.list_id,
        order: data.order,
        createdAt: new Date(data.created_at)
      }

      list.cards.push(newCard)

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to create card'
      console.error('Error creating card:', err)
    } finally {
      loading.value = false
    }
  }

  const updateCard = async (cardId: string, updates: Partial<Card>) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('cards')
        .update({
          title: updates.title,
          description: updates.description
        })
        .eq('id', cardId)

      if (updateError) throw updateError

      const board = boards.value.find(b => 
        b.lists.some(l => l.cards.some(c => c.id === cardId))
      )
      if (board) {
        const list = board.lists.find(l => l.cards.some(c => c.id === cardId))
        if (list) {
          const card = list.cards.find(c => c.id === cardId)
          if (card) {
            Object.assign(card, updates)
          }
        }
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to update card'
      console.error('Error updating card:', err)
    } finally {
      loading.value = false
    }
  }

  const deleteCard = async (cardId: string) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: deleteError } = await supabase
        .from('cards')
        .delete()
        .eq('id', cardId)

      if (deleteError) throw deleteError

      const board = boards.value.find(b => 
        b.lists.some(l => l.cards.some(c => c.id === cardId))
      )
      if (board) {
        const list = board.lists.find(l => l.cards.some(c => c.id === cardId))
        if (list) {
          const index = list.cards.findIndex(c => c.id === cardId)
          if (index !== -1) {
            list.cards.splice(index, 1)
            // Reorder remaining cards
            list.cards.forEach((card, i) => {
              card.order = i
            })
          }
        }
      }

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to delete card'
      console.error('Error deleting card:', err)
    } finally {
      loading.value = false
    }
  }

  const moveCard = async (cardId: string, fromListId: string, toListId: string, newOrder: number) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('cards')
        .update({
          list_id: toListId,
          order: newOrder
        })
        .eq('id', cardId)

      if (updateError) throw updateError

      const board = boards.value.find(b => 
        b.lists.some(l => l.cards.some(c => c.id === cardId))
      )
      if (!board) return

      const fromList = board.lists.find(l => l.id === fromListId)
      const toList = board.lists.find(l => l.id === toListId)
      
      if (!fromList || !toList) return

      const cardIndex = fromList.cards.findIndex(c => c.id === cardId)
      if (cardIndex === -1) return

      const [card] = fromList.cards.splice(cardIndex, 1)
      card.listId = toListId
      card.order = newOrder

      // Insert card at new position
      toList.cards.splice(newOrder, 0, card)

      // Reorder cards in both lists
      fromList.cards.forEach((c, i) => { c.order = i })
      toList.cards.forEach((c, i) => { c.order = i })

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to move card'
      console.error('Error moving card:', err)
    } finally {
      loading.value = false
    }
  }

  const moveList = async (listId: string, newOrder: number) => {
    loading.value = true
    error.value = null

    if (!supabase) {
      error.value = 'Supabase not configured'
      loading.value = false
      return
    }

    try {
      const { error: updateError } = await supabase
        .from('lists')
        .update({
          order: newOrder
        })
        .eq('id', listId)

      if (updateError) throw updateError

      const board = boards.value.find(b => b.lists.some(l => l.id === listId))
      if (!board) return

      const listIndex = board.lists.findIndex(l => l.id === listId)
      if (listIndex === -1) return

      const [list] = board.lists.splice(listIndex, 1)
      board.lists.splice(newOrder, 0, list)

      // Reorder all lists
      board.lists.forEach((l, i) => { l.order = i })

    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to move list'
      console.error('Error moving list:', err)
    } finally {
      loading.value = false
    }
  }

  // Real-time updates
  const setupRealtime = () => {
    if (!supabase) return
    
    // Subscribe to board changes
    supabase
      .channel('boards')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'boards' }, () => {
        loadFromDatabase()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lists' }, () => {
        loadFromDatabase()
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, () => {
        loadFromDatabase()
      })
      .subscribe()
  }

  // Setup real-time updates
  setupRealtime()

  return {
    boards,
    currentBoardId,
    currentBoard,
    sortedLists,
    loading,
    error,
    createBoard,
    updateBoard,
    deleteBoard,
    setCurrentBoard,
    createList,
    updateList,
    deleteList,
    createCard,
    updateCard,
    deleteCard,
    moveCard,
    moveList,
    loadFromDatabase
  }
}) 