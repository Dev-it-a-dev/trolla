<template>
  <div class="fixed bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-3 text-sm">
    <div class="flex items-center space-x-2">
      <div 
        :class="[
          'w-2 h-2 rounded-full',
          isConnected ? 'bg-green-500' : 'bg-red-500'
        ]"
      ></div>
      <span class="text-gray-700">
        {{ isConnected ? 'Real-time Active' : 'Real-time Inactive' }}
      </span>
    </div>
    <div v-if="lastEvent" class="text-xs text-gray-500 mt-1">
      Last event: {{ lastEvent }}
    </div>
    <button 
      @click="testRealtime"
      class="text-xs text-blue-600 hover:text-blue-800 mt-1"
    >
      Test Connection
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBoardStore } from '@/stores/board'

const boardStore = useBoardStore()
const isConnected = ref(false)
const lastEvent = ref('')

// Listen for console messages to detect real-time activity
onMounted(() => {
  const originalLog = console.log
  console.log = (...args) => {
    originalLog.apply(console, args)
    
    const message = args.join(' ')
    if (message.includes('Real-time subscriptions active')) {
      isConnected.value = true
    } else if (message.includes('Real-time subscription error')) {
      isConnected.value = false
    } else if (message.includes('change detected:')) {
      lastEvent.value = new Date().toLocaleTimeString()
    }
  }
})

const testRealtime = () => {
  // Create a test card to verify real-time is working
  if (boardStore.currentBoard && boardStore.sortedLists.length > 0) {
    const firstList = boardStore.sortedLists[0]
    boardStore.createCard('Test Card - ' + new Date().toLocaleTimeString(), firstList.id)
  }
}
</script> 