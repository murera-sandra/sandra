<template>
    <div>
        <h2 class="mb-4"> students list</h2>
        <table class ="table table-stripped table-bordered">
            <thread class="table-dark">
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Age</th>
                </tr>
            </thread>
            <tbody>
                <tr v-for="(student, index)":key="index">
                    <td>{{index+1}}</td>
                    <td>{{student.name }}</td>
                    <td>{{ student.email }}</td>
                     <td>{{ AddStudent.age }}</td>
            </tbody>
        </table>
        <p v-if="students.length==0" class="text-warning">
            no students found.Add some in the "Add Student" page!
        </p>
    </div>
</template>

<script>
export default {
    name:'students',
    data(){
        return{
            student:[
                {name:'sandra Murera',email:'sandra@gmail.com', age:19},
                {name:'Jeremiah Love',email:'jeremiah@gmail.com', age:19},
                {name:'Nancy Murera',email:'nancy@gmail.com', age:19}
            ]
        }
    }
}
</script>
