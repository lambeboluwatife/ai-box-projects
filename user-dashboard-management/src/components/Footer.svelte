 <script>
    import { UsersStore } from "../stores.svelte";
    let users = $derived($UsersStore);
    let { darkMode, filteredUsers } = $props();
 </script>

 <div class="mt-8 flex items-center justify-between text-sm {darkMode ? 'text-slate-400' : 'text-slate-600'}">
      <p>Total Users: <span class="font-semibold {darkMode ? 'text-slate-200' : 'text-slate-800'}">{users.length}</span></p>
      <p>Showing: <span class="font-semibold {darkMode ? 'text-slate-200' : 'text-slate-800'}">{filteredUsers.length}</span> {filteredUsers.length === 1 ? 'user' : 'users'}</p>
</div>