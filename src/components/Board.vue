<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <h1 class="text-xl font-semibold text-gray-900">Trolla</h1>
            <div v-if="currentBoard" class="flex items-center space-x-2">
              <span class="text-gray-400">/</span>
              <input
                v-model="boardTitle"
                @blur="updateBoardTitle"
                @keyup.enter="updateBoardTitle"
                class="text-lg font-medium text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
              />
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <button
              @click="showBoardSelector = true"
              class="btn btn-secondary"
            >
              Switch Board
            </button>
            <button
              @click="showCreateBoard = true"
              class="btn btn-primary"
            >
              New Board
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Loading State -->
      <div v-if="loading && boards.length === 0" class="text-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-600">Loading your boards...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
          <h3 class="text-lg font-semibold text-red-800 mb-2">Connection Error</h3>
          <p class="text-red-600 mb-4">{{ error }}</p>
          <button
            @click="loadFromDatabase"
            class="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else-if="!currentBoard" class="text-center py-12">
        <h2 class="text-2xl font-semibold text-gray-900 mb-4">Welcome to Trolla</h2>
        <p class="text-gray-600 mb-8">Create your first board to get started</p>
        <button
          @click="showCreateBoard = true"
          class="btn btn-primary"
        >
          Create Board
        </button>
      </div>

      <div v-else class="space-y-6">
        <!-- Board Description -->
        <div v-if="boardDescription" class="text-gray-600">
          {{ boardDescription }}
        </div>

        <!-- Lists Container -->
        <div class="flex space-x-4 overflow-x-auto pb-4">
          <div
            v-for="list in sortedLists"
            :key="list.id"
            class="list flex-shrink-0"
            @dragover="onDragOver"
            @drop="onDrop($event, list.id)"
          >
            <ListComponent
              :list="list"
              @update-list="updateList"
              @delete-list="deleteList"
              @create-card="createCard"
              @update-card="updateCard"
              @delete-card="deleteCard"
              @move-card="moveCard"
            />
          </div>

          <!-- Add List Button -->
          <div class="flex-shrink-0">
            <button
              @click="showCreateList = true"
              class="list bg-gray-200 hover:bg-gray-300 transition-colors duration-200 flex items-center justify-center text-gray-600 hover:text-gray-800"
            >
              <span class="text-lg">+</span>
              <span class="ml-2">Add List</span>
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- Modals -->
    <CreateBoardModal
      v-if="showCreateBoard"
      @close="showCreateBoard = false"
      @create="createBoard"
    />

    <BoardSelectorModal
      v-if="showBoardSelector"
      :boards="boards"
      :current-board-id="currentBoardId"
      @close="showBoardSelector = false"
      @select="setCurrentBoard"
      @delete="deleteBoard"
    />

    <CreateListModal
      v-if="showCreateList"
      @close="showCreateList = false"
      @create="createList"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useBoardStore } from '@/stores/board'
import ListComponent from './List.vue'
import CreateBoardModal from './CreateBoardModal.vue'
import BoardSelectorModal from './BoardSelectorModal.vue'
import CreateListModal from './CreateListModal.vue'

const boardStore = useBoardStore()

// Reactive state
const showCreateBoard = ref(false)
const showBoardSelector = ref(false)
const showCreateList = ref(false)
const boardTitle = ref('')

// Computed properties
const currentBoard = computed(() => boardStore.currentBoard)
const currentBoardId = computed(() => boardStore.currentBoardId)
const sortedLists = computed(() => boardStore.sortedLists)
const boards = computed(() => boardStore.boards)
const boardDescription = computed(() => currentBoard.value?.description)
const loading = computed(() => boardStore.loading)
const error = computed(() => boardStore.error)

// Initialize board title
if (currentBoard.value) {
  boardTitle.value = currentBoard.value.title
}

// Methods
const createBoard = (title: string, description?: string) => {
  boardStore.createBoard(title, description)
  showCreateBoard.value = false
}

const setCurrentBoard = (boardId: string) => {
  boardStore.setCurrentBoard(boardId)
  if (currentBoard.value) {
    boardTitle.value = currentBoard.value.title
  }
  showBoardSelector.value = false
}

const deleteBoard = (boardId: string) => {
  boardStore.deleteBoard(boardId)
  if (currentBoard.value) {
    boardTitle.value = currentBoard.value.title
  }
}

const createList = (title: string) => {
  boardStore.createList(title)
  showCreateList.value = false
}

const updateList = (listId: string, updates: any) => {
  boardStore.updateList(listId, updates)
}

const deleteList = (listId: string) => {
  boardStore.deleteList(listId)
}

const createCard = (title: string, listId: string, description?: string) => {
  boardStore.createCard(title, listId, description)
}

const updateCard = (cardId: string, updates: any) => {
  boardStore.updateCard(cardId, updates)
}

const deleteCard = (cardId: string) => {
  boardStore.deleteCard(cardId)
}

const moveCard = (cardId: string, fromListId: string, toListId: string, newOrder: number) => {
  boardStore.moveCard(cardId, fromListId, toListId, newOrder)
}

const loadFromDatabase = () => {
  boardStore.loadFromDatabase()
}

const updateBoardTitle = () => {
  if (currentBoard.value && boardTitle.value.trim()) {
    boardStore.updateBoard(currentBoard.value.id, { title: boardTitle.value.trim() })
  } else if (currentBoard.value) {
    boardTitle.value = currentBoard.value.title
  }
}

const onDragOver = (event: DragEvent) => {
  event.preventDefault()
}

const onDrop = (event: DragEvent, toListId: string) => {
  event.preventDefault()
  
  const data = event.dataTransfer?.getData('text/plain')
  if (!data) return
  
  try {
    const { cardId, fromListId } = JSON.parse(data)
    if (fromListId !== toListId) {
      // Find the target list to determine the new order
      const targetList = currentBoard.value?.lists.find(l => l.id === toListId)
      if (targetList) {
        const newOrder = targetList.cards.length
        moveCard(cardId, fromListId, toListId, newOrder)
      }
    }
  } catch (error) {
    console.error('Error parsing drag data:', error)
  }
}
</script> 