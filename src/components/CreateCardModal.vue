<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
      <div class="p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-4">Create New Card</h2>
        
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
                Description (optional)
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
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  listId: string
}

interface Emits {
  (e: 'close'): void
  (e: 'create', title: string, listId: string, description?: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const title = ref('')
const description = ref('')

const handleSubmit = () => {
  if (title.value.trim()) {
    emit('create', title.value.trim(), props.listId, description.value.trim() || undefined)
  }
}
</script> 