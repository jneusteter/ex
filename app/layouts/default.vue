<template>
  <div class="min-h-screen bg-dark-900">
    <AppNavbar />
    <main class="pb-20 lg:pb-0 lg:pl-64">
      <div class="max-w-6xl mx-auto px-4 py-6">
        <slot />
      </div>
    </main>
    <AppMobileNav />
  </div>
</template>
