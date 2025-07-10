<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Edit Card</h2>
        
        <form @submit.prevent="handleSubmit">
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 mb-1">
                Card Title *
              </label>
              <input
                id="title"
                v-model="title"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter card title"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                v-model="description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter card description"
              ></textarea>
            </div>
          </div>
          
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="$emit('close')"
              class="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="!title.trim()"
              class="btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update Card
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Card } from '@/stores/board'

interface Props {
  card: Card
}

interface Emits {
  (e: 'close'): void
  (e: 'update', cardId: string, updates: Partial<Card>): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const title = ref('')
const description = ref('')

onMounted(() => {
  title.value = props.card.title
  description.value = props.card.description || ''
})

const handleSubmit = () => {
  if (title.value.trim()) {
    emit('update', props.card.id, {
      title: title.value.trim(),
      description: description.value.trim() || undefined
    })
  }
}
</script> 