<script>
  import Header from "./components/Header.svelte";
  import AddUser from "./components/AddUser.svelte";
  import UserList from "./components/UserList.svelte";

  let title = "User Management System Dashboard";
  let darkMode = $state(false);

  const toggleDarkMode = () => {
    darkMode = !darkMode;
  };
</script>

<main class="min-h-screen p-6 lg:p-8 transition-colors duration-200 {darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800' : 'bg-gradient-to-br from-slate-50 to-slate-100'}">
  <div class="max-w-7xl mx-auto">
    <Header {title} {darkMode} {toggleDarkMode} />

    <div class="mb-8">
      <AddUser {darkMode} />
    </div>

    <UserList {darkMode} />
  </div>
</main>