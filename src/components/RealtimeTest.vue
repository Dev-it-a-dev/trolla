<template>
  <div class="fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm max-w-sm">
    <h3 class="font-semibold text-gray-900 mb-2">Real-time Test</h3>
    
    <div class="space-y-2">
      <div class="flex items-center space-x-2">
        <div 
          :class="[
            'w-2 h-2 rounded-full',
            connectionStatus === 'connected' ? 'bg-green-500' : 
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          ]"
        ></div>
        <span class="text-gray-700">
          {{ connectionStatus === 'connected' ? 'Connected' : 
             connectionStatus === 'connecting' ? 'Connecting...' : 'Disconnected' }}
        </span>
      </div>
      
      <div v-if="lastMessage" class="text-xs text-gray-500">
        Last message: {{ lastMessage }}
      </div>
      
      <div class="flex space-x-2">
        <button 
          @click="testInsert"
          class="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
        >
          Test Insert
        </button>
        <button 
          @click="testUpdate"
          class="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
        >
          Test Update
        </button>
        <button 
          @click="reconnect"
          class="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
        >
          Reconnect
        </button>
      </div>
      
      <div v-if="error" class="text-xs text-red-600 bg-red-50 p-2 rounded">
        {{ error }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { supabase } from '@/lib/supabase'

const connectionStatus = ref<'disconnected' | 'connecting' | 'connected'>('disconnected')
const lastMessage = ref('')
const error = ref('')
let channel: any = null

const setupRealtime = () => {
  if (!supabase) {
    error.value = 'Supabase not configured'
    return
  }
  
  connectionStatus.value = 'connecting'
  error.value = ''
  
  try {
    channel = supabase
      .channel('test-channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cards' }, (payload) => {
        console.log('Test real-time event:', payload)
        lastMessage.value = `${payload.eventType} on ${payload.table} at ${new Date().toLocaleTimeString()}`
      })
      .subscribe((status) => {
        console.log('Test subscription status:', status)
        if (status === 'SUBSCRIBED') {
          connectionStatus.value = 'connected'
          lastMessage.value = 'Connected at ' + new Date().toLocaleTimeString()
        } else if (status === 'CHANNEL_ERROR') {
          connectionStatus.value = 'disconnected'
          error.value = 'Channel error occurred'
        } else if (status === 'TIMED_OUT') {
          connectionStatus.value = 'disconnected'
          error.value = 'Connection timed out'
        }
      })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
    connectionStatus.value = 'disconnected'
  }
}

const testInsert = async () => {
  if (!supabase || !connectionStatus.value === 'connected') return
  
  try {
    // Get the first board and list to create a test card
    const { data: boards } = await supabase.from('boards').select('id').limit(1)
    if (!boards || boards.length === 0) {
      error.value = 'No boards found'
      return
    }
    
    const { data: lists } = await supabase
      .from('lists')
      .select('id')
      .eq('board_id', boards[0].id)
      .limit(1)
    
    if (!lists || lists.length === 0) {
      error.value = 'No lists found'
      return
    }
    
    const { error: insertError } = await supabase
      .from('cards')
      .insert({
        title: 'Test Card ' + new Date().toLocaleTimeString(),
        list_id: lists[0].id,
        order: 0
      })
    
    if (insertError) {
      error.value = insertError.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  }
}

const testUpdate = async () => {
  if (!supabase) return
  
  try {
    const { data: cards } = await supabase.from('cards').select('id').limit(1)
    if (!cards || cards.length === 0) {
      error.value = 'No cards found to update'
      return
    }
    
    const { error: updateError } = await supabase
      .from('cards')
      .update({ title: 'Updated ' + new Date().toLocaleTimeString() })
      .eq('id', cards[0].id)
    
    if (updateError) {
      error.value = updateError.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Unknown error'
  }
}

const reconnect = () => {
  if (channel) {
    channel.unsubscribe()
  }
  setupRealtime()
}

onMounted(() => {
  setupRealtime()
})

onUnmounted(() => {
  if (channel) {
    channel.unsubscribe()
  }
})
</script> 