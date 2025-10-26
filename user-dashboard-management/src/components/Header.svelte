<script>
    let { title, darkMode, toggleDarkMode } = $props();
</script>

<div class="mb-8 flex items-start justify-between">
      <div>
        <h1 class="text-4xl font-bold mb-2 {darkMode ? 'text-white' : 'text-slate-800'}">{title}</h1>
        <p class="{darkMode ? 'text-slate-400' : 'text-slate-600'}">Manage your team members and their roles</p>
      </div>
      
      <button
        onclick={toggleDarkMode}
        class="p-3 rounded-lg transition-all duration-200 cursor-pointer {darkMode ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'} shadow-sm"
        aria-label="Toggle dark mode"
      >
        {#if darkMode}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        {:else}
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        {/if}
      </button>
    </div>
    