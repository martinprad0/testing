<script lang="ts">
 import { messages, pushMessage, loadMessages } from "$lib/global";
let title = $state("");
let subtitle = $state("");
let id = $derived(
  $messages.length > 0 ? Math.max(...$messages.map((m) => m.id)) + 1 : 0
);
let date = $state(new Date().toISOString());

// Update date every second
setInterval(() => {
  date = new Date().toISOString();
}, 1000);

async function addMessage() {
  if (!title.trim() || !subtitle.trim()) return;
  
  const newMessage = {
    id: id,
    title: title.trim(),
    subtitle: subtitle.trim(), 
    date: date
  };
  
  try {
    // Add to local store first
    messages.update(msgs => [newMessage, ...msgs]);
    
    // Save to Firebase
    await pushMessage(newMessage);

    await loadMessages();
    
    // Clear form and increment ID
    title = "";
    subtitle = "";
    id = id + 1;
    
    console.log('Message added successfully');
  } catch (error) {
    console.error('Failed to add message:', error);
    // Remove from local store if Firebase failed
    messages.update(msgs => msgs.filter(m => m.id !== newMessage.id));
  }
}
</script>

<div class="flex items-center gap-4 p-4 border rounded-lg">
  <input 
    type="text" 
    bind:value={title} 
    placeholder="Enter title..."
    class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <input 
    type="text" 
    bind:value={subtitle} 
    placeholder="Enter subtitle..."
    class="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  
  <button 
    onclick={addMessage}
    class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
    disabled={!title.trim() || !subtitle.trim()}
  >
    Add Message
  </button>
</div>