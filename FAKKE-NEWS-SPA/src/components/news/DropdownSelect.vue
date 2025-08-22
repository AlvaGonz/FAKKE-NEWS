<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';

interface Option {
  value: string | number | undefined;
  label: string;
}

interface Props {
  modelValue?: string | number | undefined;
  options: Option[];
  placeholder?: string;
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Seleccionar...',
  label: ''
});

const emit = defineEmits<{
  'update:modelValue': [value: string | number | undefined];
}>();

const isOpen = ref(false);
const dropdownRef = ref<HTMLDivElement>();

function toggle() {
  isOpen.value = !isOpen.value;
}

function select(option: Option) {
  emit('update:modelValue', option.value);
  isOpen.value = false;
}

function closeOnClickOutside(event: Event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

function closeOnEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    isOpen.value = false;
  }
}

const selectedOption = computed(() => {
  return props.options.find(opt => opt.value === props.modelValue);
});

onMounted(() => {
  document.addEventListener('click', closeOnClickOutside);
  document.addEventListener('keydown', closeOnEscape);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnClickOutside);
  document.removeEventListener('keydown', closeOnEscape);
});
</script>

<template>
  <div class="dropdown-select" ref="dropdownRef">
    <button 
      type="button"
      class="trigger" 
      @click="toggle"
      :aria-expanded="isOpen"
      :aria-label="label"
    >
      <span class="value">{{ selectedOption?.label || placeholder }}</span>
      <svg class="arrow" :class="{ open: isOpen }" width="12" height="12" viewBox="0 0 12 12">
        <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <transition name="dropdown">
      <div v-if="isOpen" class="options" role="listbox">
        <button
          v-for="option in options"
          :key="option.value"
          type="button"
          class="option"
          :class="{ selected: option.value === modelValue }"
          @click="select(option)"
          role="option"
          :aria-selected="option.value === modelValue"
        >
          {{ option.label }}
        </button>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.dropdown-select {
  position: relative;
  display: inline-block;
  width: 100%;
}

.trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.55rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #333;
}

.trigger:hover {
  border-color: #bbb;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.trigger:focus {
  outline: none;
  border-color: var(--accent, #e23b2e);
  box-shadow: 0 0 0 3px rgba(226, 59, 46, 0.1);
}

.value {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.arrow {
  flex-shrink: 0;
  margin-left: 0.5rem;
  transition: transform 0.2s ease;
  color: #666;
}

.arrow.open {
  transform: rotate(180deg);
}

.options {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.option {
  width: 100%;
  padding: 0.6rem 0.75rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
  font-size: 14px;
  color: #333;
}

.option:hover {
  background-color: #f8f8f8;
}

.option.selected {
  background-color: var(--accent, #e23b2e);
  color: #fff;
}

.option:first-child {
  border-radius: 12px 12px 0 0;
}

.option:last-child {
  border-radius: 0 0 12px 12px;
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
