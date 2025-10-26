<script>
    import { addUser } from "../stores.svelte";
    let name = $state('');
    let email = $state('');
    let role = $state('');
    let errorMessage = $state('');

     let {darkMode} = $props();

    const submitForm = (e) => {
        e.preventDefault();
        
        errorMessage = '';
        
        if (!name.trim()) {
            errorMessage = 'Name is required';
            return;
        }
        
        if (!email.trim()) {
            errorMessage = 'Email is required';
            return;
        }
        
        if (!role.trim()) {
            errorMessage = 'Role is required';
            return;
        }

        const newUser = {
            id: crypto.randomUUID(),
            name: name.trim(),
            email: email.trim(),
            role: role.trim()
        };

        addUser(newUser);
        name = '';
        email = '';
        role = '';
        errorMessage = '';
    }
</script>

{#snippet selectOption()}
    <option value="" disabled selected>Select role</option>
    <option value="admin">Admin</option>
    <option value="developer">Developer</option>
    <option value="designer">Designer</option>
    <option value="manager">Manager</option>
    <option value="analyst">Analyst</option>
    <option value="engineer">Engineer</option>
{/snippet}

<div class="rounded-xl shadow-sm p-6 transition-colors duration-200 {darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'}">
    <h2 class="text-xl font-semibold mb-4 {darkMode ? 'text-white' : 'text-slate-800'}">Add New User</h2>
    
    {#if errorMessage}
        <div class="mb-4 p-3 rounded-lg flex items-center gap-2 {darkMode ? 'bg-red-900/30 border border-red-800 text-red-300' : 'bg-red-50 border border-red-200 text-red-700'}">
            <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium">{errorMessage}</span>
        </div>
    {/if}
    
    <form onsubmit={submitForm} class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="flex flex-col">
            <label for="name" class="text-sm font-medium mb-1 {darkMode ? 'text-slate-300' : 'text-slate-700'}">Name</label>
            <input 
                id="name"
                type="text" 
                placeholder="John Doe" 
                bind:value={name}
                class="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all {darkMode ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500' : 'border border-slate-300'}"
            />
        </div>

        <div class="flex flex-col">
            <label for="email" class="text-sm font-medium mb-1 {darkMode ? 'text-slate-300' : 'text-slate-700'}">Email</label>
            <input 
                id="email"
                type="email" 
                placeholder="john@example.com" 
                bind:value={email}
                class="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all {darkMode ? 'bg-slate-900 border-slate-600 text-white placeholder-slate-500' : 'border border-slate-300'}"
            />
        </div>

        <div class="flex flex-col">
            <label for="role" class="text-sm font-medium mb-1 {darkMode ? 'text-slate-300' : 'text-slate-700'}">Role</label>
            <select 
                id="role"
                bind:value={role}
                class="px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer appearance-none bg-no-repeat bg-right {darkMode ? 'bg-slate-900 border-slate-600 text-white [&>option]:bg-slate-900 [&>option]:text-white' : 'border border-slate-300 bg-white [&>option]:bg-white [&>option]:text-slate-900'}"
                style="background-image: url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27{darkMode ? '%23cbd5e1' : '%23475569'}%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e'); background-position: right 0.5rem center; background-size: 1.25rem;"
            >
                   {@render selectOption() }
            </select>
        </div>

        <div class="flex flex-col justify-end">
            <button 
                type="submit"
                class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md active:scale-95 transform"
            >
                Add User
            </button>
        </div>
    </form>
</div>