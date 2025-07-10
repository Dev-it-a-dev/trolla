<template>
  <div class="list bg-gray-100 rounded-lg p-3 min-w-64">
    <!-- List Header -->
    <div class="flex items-center justify-between mb-3">
      <input
        v-model="listTitle"
        @blur="updateListTitle"
        @keyup.enter="updateListTitle"
        class="font-semibold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1 flex-1"
      />
      <button
        @click="deleteList"
        class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
        title="Delete list"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>

    <!-- Cards Container -->
    <div class="space-y-2 mb-3">
      <div
        v-for="card in sortedCards"
        :key="card.id"
        class="card cursor-pointer hover:shadow-md transition-shadow duration-200"
        draggable="true"
        @dragstart="onDragStart($event, card)"
        @click="editCard(card)"
      >
        <h3 class="font-medium text-gray-900 mb-1">{{ card.title }}</h3>
        <p v-if="card.description" class="text-sm text-gray-600 line-clamp-2">
          {{ card.description }}
        </p>
        <div class="flex items-center justify-between mt-2">
          <span class="text-xs text-gray-400">
            {{ formatDate(card.createdAt) }}
          </span>
          <button
            @click.stop="deleteCard(card.id)"
            class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
            title="Delete card"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Add Card Button -->
    <button
      @click="showCreateCard = true"
      class="w-full text-left text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded p-2 transition-colors duration-200"
    >
      + Add a card
    </button>

    <!-- Create Card Modal -->
    <CreateCardModal
      v-if="showCreateCard"
      :list-id="list.id"
      @close="showCreateCard = false"
      @create="createCard"
    />

    <!-- Edit Card Modal -->
    <EditCardModal
      v-if="showEditCard && selectedCard"
      :card="selectedCard"
      @close="showEditCard = false"
      @update="updateCard"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { List, Card } from '@/stores/board'
import CreateCardModal from './CreateCardModal.vue'
import EditCardModal from './EditCardModal.vue'

interface Props {
  list: List
}

interface Emits {
  (e: 'update-list', listId: string, updates: Partial<List>): void
  (e: 'delete-list', listId: string): void
  (e: 'create-card', title: string, listId: string, description?: string): void
  (e: 'update-card', cardId: string, updates: Partial<Card>): void
  (e: 'delete-card', cardId: string): void
  (e: 'move-card', cardId: string, fromListId: string, toListId: string, newOrder: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Reactive state
const listTitle = ref(props.list.title)
const showCreateCard = ref(false)
const showEditCard = ref(false)
const selectedCard = ref<Card | null>(null)

// Computed properties
const sortedCards = computed(() => {
  return [...props.list.cards].sort((a, b) => a.order - b.order)
})

// Methods
const updateListTitle = () => {
  if (listTitle.value.trim()) {
    emit('update-list', props.list.id, { title: listTitle.value.trim() })
  } else {
    listTitle.value = props.list.title
  }
}

const deleteList = () => {
  if (confirm('Are you sure you want to delete this list?')) {
    emit('delete-list', props.list.id)
  }
}

const createCard = (title: string, listId: string, description?: string) => {
  emit('create-card', title, listId, description)
  showCreateCard.value = false
}

const updateCard = (cardId: string, updates: Partial<Card>) => {
  emit('update-card', cardId, updates)
  showEditCard.value = false
  selectedCard.value = null
}

const deleteCard = (cardId: string) => {
  if (confirm('Are you sure you want to delete this card?')) {
    emit('delete-card', cardId)
  }
}

const editCard = (card: Card) => {
  selectedCard.value = card
  showEditCard.value = true
}

const onDragStart = (event: DragEvent, card: Card) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', JSON.stringify({
      cardId: card.id,
      fromListId: props.list.id
    }))
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 