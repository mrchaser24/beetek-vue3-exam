<template>
  <v-container fluid>
    <!-- Header -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <h1 class="text-h4 font-weight-bold mb-2">My Items</h1>
        <p class="text-subtitle-1 text-medium-emphasis">
          Manage your personal collection of items
        </p>
      </v-col>
      <v-col cols="12" md="4" class="d-flex align-center justify-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="elevated"
          @click="openAddDialog"
          class="me-3"
        >
          Add Item
        </v-btn>
        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-logout"
          @click="handleSignOut"
        >
          Sign Out
        </v-btn>
      </v-col>
    </v-row>

    <!-- User Info Card -->
    <v-card class="mb-6" variant="tonal">
      <v-card-text class="d-flex align-center">
        <v-avatar class="me-4" size="48">
          <v-img :src="user?.photoURL" :alt="user?.displayName" />
        </v-avatar>
        <div>
          <h3 class="text-h6">{{ user?.displayName }}</h3>
          <p class="text-body-2 text-medium-emphasis">{{ user?.email }}</p>
        </div>
      </v-card-text>
    </v-card>

    <!-- Data Table -->
    <v-card>
      <v-card-title class="d-flex align-center pa-4">
        <v-icon class="me-2">mdi-format-list-bulleted</v-icon>
        Items ({{ items.length }})
        <v-spacer />
        <v-text-field
          v-model="search"
          density="compact"
          label="Search items..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          single-line
          clearable
          class="me-4"
          style="max-width: 300px;"
        />
      </v-card-title>
      
      <v-data-table
        :headers="headers"
        :items="items"
        :search="search"
        :loading="loading"
        class="elevation-0"
        :items-per-page="10"
        :no-data-text="loading ? 'Loading items...' : 'No items found. Click &quot;Add Item&quot; to get started.'"
      >
        <template v-slot:item.name="{ item }">
          <div class="font-weight-medium">{{ item.name }}</div>
        </template>

        <template v-slot:item.description="{ item }">
          <div class="text-truncate" style="max-width: 300px;" :title="item.description">
            {{ item.description }}
          </div>
        </template>

        <template v-slot:item.createdAt="{ item }">
          <div class="text-body-2">
            {{ formatDate(item.createdAt) }}
          </div>
        </template>

        <!-- Actions column -->
        <template v-slot:item.actions="{ item }">
          <div class="d-flex gap-2">
            <v-btn
              icon="mdi-pencil"
              size="small"
              variant="text"
              color="primary"
              @click="openEditDialog(item)"
            />
            <v-btn
              icon="mdi-delete"
              size="small"
              variant="text"
              color="error"
              @click="openDeleteDialog(item)"
            />
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Item Dialog (Add/Edit) -->
    <ItemDialog
      v-model:dialog="dialog"
      :item="editingItem"
      :loading="dialogLoading"
      @save="saveItem"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-title class="text-h5">
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete "{{ deletingItem?.name }}"? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="deleteDialog = false"
            :disabled="dialogLoading"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="elevated"
            @click="confirmDelete"
            :loading="dialogLoading"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Success/Error Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :timeout="4000"
      :color="snackbar.color"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useItems } from '@/composables/useItems'
import ItemDialog from '@/components/ItemDialog.vue'

const { user, signOutUser } = useAuth()
const userId = computed(() => user.value?.uid)
const { items, loading, subscribeToItems, addItem, updateItem, deleteItem, cleanup } = useItems(userId)

// Data table configuration
const search = ref('')
const headers = [
  { title: 'Name', key: 'name', sortable: true },
  { title: 'Description', key: 'description', sortable: false },
  { title: 'Created', key: 'createdAt', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, width: '120px' }
]

// Dialog states
const dialog = ref(false)
const deleteDialog = ref(false)
const dialogLoading = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)

// Snackbar state
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Methods
const openAddDialog = () => {
  editingItem.value = null
  dialog.value = true
}

const openEditDialog = (item) => {
  editingItem.value = { ...item }
  dialog.value = true
}

const openDeleteDialog = (item) => {
  deletingItem.value = item
  deleteDialog.value = true
}

const saveItem = async (itemData) => {
  try {
    dialogLoading.value = true
    
    if (itemData.id) {
      await updateItem(itemData.id, {
        name: itemData.name,
        description: itemData.description
      })
      showSnackbar('Item updated successfully!', 'success')
    } else {
      await addItem({
        name: itemData.name,
        description: itemData.description
      })
      showSnackbar('Item added successfully!', 'success')
    }
    
    dialog.value = false
  } catch (error) {
    console.error('Error saving item:', error)
    showSnackbar('Failed to save item. Please try again.', 'error')
  } finally {
    dialogLoading.value = false
  }
}

const confirmDelete = async () => {
  try {
    dialogLoading.value = true
    await deleteItem(deletingItem.value.id)
    deleteDialog.value = false
    showSnackbar('Item deleted successfully!', 'success')
  } catch (error) {
    console.error('Error deleting item:', error)
    showSnackbar('Failed to delete item. Please try again.', 'error')
  } finally {
    dialogLoading.value = false
  }
}

const handleSignOut = async () => {
  try {
    await signOutUser()
  } catch (error) {
    console.error('Error signing out:', error)
    showSnackbar('Failed to sign out. Please try again.', 'error')
  }
}

const formatDate = (date) => {
  if (!date) return ''
  
  // Handle Firestore Timestamp
  const dateObj = date.toDate ? date.toDate() : new Date(date)
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showSnackbar = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Lifecycle
onMounted(() => {
  if (userId.value) {
    subscribeToItems()
  }
})

onUnmounted(() => {
  cleanup()
})

import { watch } from 'vue'
watch(userId, (newUserId) => {
  if (newUserId) {
    subscribeToItems()
  }
}, { immediate: true })
</script>

<style scoped>
.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
