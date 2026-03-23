<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <router-link class ="navbar-brand" to="/">StudentApp</router-link>
                <div>
                    <router-link class="btn btn-outline-light me-2" to="/"></router-link>
                    <router-link class="btn btn-outline-light me-2" to="/add">Add Student</router-link>
                    <router-link class=" btn btn-outline-light me-2" to="/students">Students</router-link>
                </div>
            </div>
        </nav>
        <div Class ="container mt-4">
            <router-view/>
        </div>
    </div>
</template>