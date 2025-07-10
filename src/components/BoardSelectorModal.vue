<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-96 overflow-hidden">
      <div class="p-6">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-xl font-semibold text-gray-900">Select Board</h2>
          <button
            @click="$emit('close')"
            class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="space-y-2 max-h-64 overflow-y-auto">
          <div
            v-for="board in boards"
            :key="board.id"
            class="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200"
            :class="{ 'bg-blue-50 border-blue-200': board.id === currentBoardId }"
          >
            <div class="flex-1">
              <div class="flex items-center space-x-3">
                <button
                  @click="$emit('select', board.id)"
                  class="text-left flex-1"
                >
                  <h3 class="font-medium text-gray-900">{{ board.title }}</h3>
                  <p v-if="board.description" class="text-sm text-gray-600 mt-1">
                    {{ board.description }}
                  </p>
                  <p class="text-xs text-gray-400 mt-1">
                    Created {{ formatDate(board.createdAt) }}
                  </p>
                </button>
              </div>
            </div>
            
            <div class="flex items-center space-x-2">
              <span
                v-if="board.id === currentBoardId"
                class="text-xs text-blue-600 font-medium"
              >
                Current
              </span>
              <button
                @click="deleteBoard(board.id)"
                class="text-gray-400 hover:text-red-500 transition-colors duration-200 p-1"
                title="Delete board"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div v-if="boards.length === 0" class="text-center py-8 text-gray-500">
            No boards found. Create your first board to get started.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Board } from '@/stores/board'

interface Props {
  boards: Board[]
  currentBoardId: string | null
}

interface Emits {
  (e: 'close'): void
  (e: 'select', boardId: string): void
  (e: 'delete', boardId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const deleteBoard = (boardId: string) => {
  if (confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
    emit('delete', boardId)
  }
}

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString()
}
</script> 