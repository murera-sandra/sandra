import {createRouter,createWebHistory} from 'vue-router'
import Home from '../views/Home.vue'
import AddStudent from'../views/AddStudent.vue'
import Student from '../views/Students.vue'

const routes =[
    {path:'/',component:Home},
    {path:'/add',component:AddStudent},
    {path:'/students',component:Student}
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router