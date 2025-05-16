<script setup>
defineProps({
  title: String,
  description: String,
  href: String,
});
</script>

<template>
  <a :href="href" class="card-link" target="_blank" rel="noopener noreferrer">
    <div class="card-link-content">
      <h3 class="card-link-title">{{ title }}</h3>
      <p class="card-link-description">{{ description }}</p>
    </div>
  </a>
</template>

<style scoped>
.card-link {
  display: block;
  background: var(--vp-c-bg-soft, #f9f9f9);
  border: 1px solid var(--vp-c-border, #e5e7eb);
  border-radius: 12px;
  padding: 1.25rem 1rem;
  text-decoration: none;
  color: inherit;
  transition:
    box-shadow 0.2s,
    border-color 0.2s;
  box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.04);
}
.card-link:hover {
  border-color: var(--vp-c-brand, #0070f3);
  box-shadow: 0 4px 16px 0 rgba(0, 112, 243, 0.08);
}
.card-link-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.15rem;
  font-weight: 600;
}
.card-link-description {
  margin: 0;
  color: var(--vp-c-text-2, #555);
  font-size: 1rem;
}
</style>
