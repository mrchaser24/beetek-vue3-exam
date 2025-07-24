import { ref, onMounted, onUnmounted } from 'vue'
import { 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider 
} from 'firebase/auth'
import { auth, googleProvider } from '@/plugins/firebase'

const user = ref(null)
const loading = ref(true)

export function useAuth() {
  let unsubscribe = null

  const signInWithGoogle = async () => {
    try {
      loading.value = true
      const result = await signInWithPopup(auth, googleProvider)
      const credential = GoogleAuthProvider.credentialFromResult(result)
      const token = credential.accessToken
      user.value = result.user
      return { user: result.user, token }
    } catch (error) {
      console.error('Error signing in with Google:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const signOutUser = async () => {
    try {
      await signOut(auth)
      user.value = null
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  const initAuth = () => {
    unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      user.value = firebaseUser
      loading.value = false
    })
  }

  const cleanup = () => {
    if (unsubscribe) {
      unsubscribe()
    }
  }

  return {
    user,
    loading,
    signInWithGoogle,
    signOutUser,
    initAuth,
    cleanup
  }
}
