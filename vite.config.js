// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vitejs.dev/config/
// export default defineConfig({
//   plugins: [react()],
// })
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // تأكد أن هذا الاسم هو نفس اسم الـ Repository بتاعك على GitHub
  // إذا كان اسم الريبو هو IndusConnect- (بما فيه الشرطة)، اكتبه كما هو
  base: '/IndusConnect-/', 
  plugins: [react()],
})