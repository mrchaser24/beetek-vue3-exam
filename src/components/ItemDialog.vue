<template>
  <v-dialog
    v-model="internalDialog"
    max-width="600px"
    persistent
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ isEdit ? 'Edit Item' : 'Add New Item' }}</span>
      </v-card-title>
      
      <v-card-text>
        <v-container>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-text-field
              v-model="formData.name"
              :rules="nameRules"
              label="Item Name"
              variant="outlined"
              required
              class="mb-3"
            />
            
            <v-textarea
              v-model="formData.description"
              :rules="descriptionRules"
              label="Description"
              variant="outlined"
              rows="4"
              required
            />
          </v-form>
        </v-container>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="grey-darken-1"
          variant="text"
          @click="closeDialog"
          :disabled="loading"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          variant="elevated"
          @click="saveItem"
          :loading="loading"
          :disabled="!valid"
        >
          {{ isEdit ? 'Update' : 'Save' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  dialog: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:dialog', 'save'])

const form = ref(null)
const valid = ref(false)

const formData = ref({
  name: '',
  description: ''
})

const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length >= 3) || 'Name must be at least 3 characters',
  v => (v && v.length <= 50) || 'Name must be less than 50 characters'
]

const descriptionRules = [
  v => !!v || 'Description is required',
  v => (v && v.length >= 10) || 'Description must be at least 10 characters',
  v => (v && v.length <= 500) || 'Description must be less than 500 characters'
]

const internalDialog = computed({
  get: () => props.dialog,
  set: (val) => emit('update:dialog', val)
})

const isEdit = computed(() => !!props.item)

const saveItem = async () => {
  const { valid: isValid } = await form.value.validate()
  
  if (isValid) {
    emit('save', {
      ...formData.value,
      id: props.item?.id
    })
  }
}

const closeDialog = () => {
  internalDialog.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    name: '',
    description: ''
  }
  if (form.value) {
    form.value.resetValidation()
  }
}

watch(() => props.dialog, (newVal) => {
  if (newVal && props.item) {
    formData.value = {
      name: props.item.name || '',
      description: props.item.description || ''
    }
  } else if (newVal) {
    resetForm()
  }
})
</script>
