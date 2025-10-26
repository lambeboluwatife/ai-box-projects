<script>
    import { fade, scale } from 'svelte/transition'
    import { UsersStore, editUser, deleteUser } from "../stores.svelte"
    import { getRoleBadgeColor } from "../utils/roleColors"
    import Footer from "./Footer.svelte";

    let { darkMode } = $props();
    let editingId = $state(null);
    let editForm = $state({ name: '', email: '', role: '' });

    let users = $derived($UsersStore);
    
    let searchQuery = $state('');

    const filteredUsers = $derived(
        users.filter(user => 
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.role.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const startEdit = (user) => {
        editingId = user.id;
        editForm = { name: user.name, email: user.email, role: user.role };
    }

    const cancelEdit = () => {
        editingId = null;
        editForm = { name: '', email: '', role: '' };
    }

    const saveEdit = (id) => {
        editUser({ id, ...editForm });
        cancelEdit();
    }
</script>

 <div class="mb-6">
      <div class="relative">
        <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 {darkMode ? 'text-slate-500' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
        <input 
          type="text" 
          placeholder="Search users by name, email, or role..." 
          bind:value={searchQuery}
          class="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all {darkMode ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-200 border'}"
        />
      </div>
    </div>

<div class="rounded-xl shadow-sm overflow-hidden transition-colors duration-200 {darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}">
    {#if filteredUsers.length === 0}
        <div class="p-12 text-center">
            <svg class="mx-auto h-12 w-12 {darkMode ? 'text-slate-600' : 'text-slate-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <p class="mt-4 {darkMode ? 'text-slate-400' : 'text-slate-600'}">No users found</p>
        </div>
    {:else}
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead class="{darkMode ? 'bg-slate-900 border-b border-slate-700' : 'bg-slate-50 border-b border-slate-200'}">
                    <tr>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider {darkMode ? 'text-slate-400' : 'text-slate-700'}">Name</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider {darkMode ? 'text-slate-400' : 'text-slate-700'}">Email</th>
                        <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider {darkMode ? 'text-slate-400' : 'text-slate-700'}">Role</th>
                        <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider {darkMode ? 'text-slate-400' : 'text-slate-700'}">Actions</th>
                    </tr>
                </thead>
                <tbody class="{darkMode ? 'divide-y divide-slate-700' : 'divide-y divide-slate-200'}">
                    {#each filteredUsers as user (user.id)}
                        <tr class="transition-colors {darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}" in:scale out:fade={{ duration: 500 }}>
                            {#if editingId === user.id}
                                <td class="px-6 py-4">
                                    <input 
                                        type="text" 
                                        bind:value={editForm.name}
                                        class="w-full px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 {darkMode ? 'bg-slate-900 border-slate-600 text-white' : 'border border-slate-300'}"
                                    />
                                </td>
                                <td class="px-6 py-4">
                                    <input 
                                        type="email" 
                                        bind:value={editForm.email}
                                        class="w-full px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 {darkMode ? 'bg-slate-900 border-slate-600 text-white' : 'border border-slate-300'}"
                                    />
                                </td>
                                <td class="px-6 py-4">
                                    <input 
                                        type="text" 
                                        bind:value={editForm.role}
                                        class="w-full px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 {darkMode ? 'bg-slate-900 border-slate-600 text-white' : 'border border-slate-300'}"
                                    />
                                </td>
                                <td class="px-6 py-4 text-right">
                                    <button 
                                        onclick={() => saveEdit(user.id)}
                                        class="font-medium mr-3 transition-colors cursor-pointer {darkMode ? 'text-green-400 hover:text-green-300' : 'text-green-600 hover:text-green-800'}"
                                    >
                                        Save
                                    </button>
                                    <button 
                                        onclick={cancelEdit}
                                        class="font-medium transition-colors {darkMode ? 'text-slate-400 hover:text-slate-300' : 'text-slate-600 hover:text-slate-800'}"
                                    >
                                        Cancel
                                    </button>
                                </td>
                            {:else}
                                <td class="px-6 py-4">
                                    <div class="text-sm font-medium {darkMode ? 'text-white' : 'text-slate-900'}">{user.name}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <div class="text-sm {darkMode ? 'text-slate-400' : 'text-slate-600'}">{user.email}</div>
                                </td>
                                <td class="px-6 py-4">
                                    <span class="inline-flex px-3 py-1 text-xs font-semibold rounded-full {getRoleBadgeColor(user.role)}">
                                        {user.role}
                                    </span>
                                </td>
                                <td class="px-6 py-4 text-right space-x-2">
                                    <button 
                                        onclick={() => startEdit(user)}
                                        class="inline-flex items-center px-3 py-1 text-sm rounded transition-colors cursor-pointer {darkMode ? 'text-blue-400 hover:text-blue-300 hover:bg-slate-700' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50'}"
                                    >
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                        </svg>
                                        Edit
                                    </button>
                                    <button 
                                        onclick={() => deleteUser(user.id)}
                                        class="inline-flex items-center px-3 py-1 text-sm rounded transition-colors cursor-pointer {darkMode ? 'text-red-400 hover:text-red-300 hover:bg-slate-700' : 'text-red-600 hover:text-red-800 hover:bg-red-50'}"
                                    >
                                        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                        </svg>
                                        Delete
                                    </button>
                                </td>
                            {/if}
                        </tr>
                    {/each}
                </tbody>
            </table>
        </div>
    {/if}
</div>

<Footer {darkMode} {filteredUsers}/>