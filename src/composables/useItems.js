import { ref, computed } from 'vue'
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  onSnapshot,
  orderBy 
} from 'firebase/firestore'
import { db } from '@/plugins/firebase'

const items = ref([])
const loading = ref(false)

export function useItems(userId) {
  let unsubscribe = null

  const itemsCollection = computed(() => {
    return userId.value ? collection(db, 'items') : null
  })

  const subscribeToItems = () => {
    if (!userId.value || !itemsCollection.value) return

    loading.value = true
    
    const q = query(
      itemsCollection.value, 
      where('userId', '==', userId.value),
      orderBy('createdAt', 'desc')
    )
    
    unsubscribe = onSnapshot(q, (snapshot) => {
      items.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loading.value = false
    }, (error) => {
      console.error('Error listening to items:', error)
      loading.value = false
    })
  }

  const addItem = async (itemData) => {
    if (!userId.value || !itemsCollection.value) return

    try {
      loading.value = true
      const docRef = await addDoc(itemsCollection.value, {
        ...itemData,
        userId: userId.value,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      return docRef.id
    } catch (error) {
      console.error('Error adding item:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateItem = async (itemId, itemData) => {
    if (!userId.value) return

    try {
      loading.value = true
      const itemRef = doc(db, 'items', itemId)
      await updateDoc(itemRef, {
        ...itemData,
        updatedAt: new Date()
      })
    } catch (error) {
      console.error('Error updating item:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const deleteItem = async (itemId) => {
    if (!userId.value) return

    try {
      loading.value = true
      const itemRef = doc(db, 'items', itemId)
      await deleteDoc(itemRef)
    } catch (error) {
      console.error('Error deleting item:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }

  return {
    items,
    loading,
    subscribeToItems,
    addItem,
    updateItem,
    deleteItem,
    cleanup
  }
}
