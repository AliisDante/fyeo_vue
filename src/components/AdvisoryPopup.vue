<script setup>
import { ref, onMounted } from 'vue';

let reveal = ref("hidden");
let ans = ref(["bg-blue-600","bg-blue-600"]);
let complete = ref("");

let bank = [
    {
        "q": "I can share keys with anyone",
        "a": false,
        "e": "False! Only share keys with people you trust"
    },{
        "q": "Never share personal details online",
        "a": true,
        "e": "True! Info can be used against you"
    },{
        "q": "Use a VPN in public WiFi",
        "a": true,
        "e": "True! Public wifi is not secure"
    }
]

let points = 0
if (localStorage.score) {
    points = Number(localStorage.score);
} else {
  localStorage.score = 0;
}

let pick = bank[Math.floor(Math.random() * 3)];

function checkAnswer(r){
    if (r == pick["a"]){
        //correct
        alert("correct, you earn a point!")
        points += 1;
        localStorage.score = Number(localStorage.score) + 1;
    }else{
        alert("wrong, no points :(")
    }

    if (pick["a"] == false){
        falseUpdate();
    }else{
        trueUpdate();
    }
}

function falseUpdate(){
    reveal.value='';
    ans.value=['bg-red-600','bg-green-600'];
}

function trueUpdate(){
    reveal.value='';
    ans.value=['bg-green-600','bg-red-600'];
}

</script>

<template>
    <div v-bind:class="complete" class="w-screen h-screen absolute bg-gray-800 z-10 top-0">
    <div role="status" class="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2 z-10">
        <div class="block max-w-sm p-6 border-gray-700 border rounded-lg  bg-gray-700 w-100vm">
            <h1 class="text-white text-2xl my-8">Security Awareness Quiz</h1>
            <h1 class="text-white text-2xl my-8">Question: {{ pick["q"] }}</h1>
            <div class="inline-flex rounded-md shadow-sm" role="group">
            <button type="button" v-bind:class="ans[0]" @click="checkAnswer(true)" class="text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none dark:focus:ring-blue-800">True</button>
            <button type="button" @click="checkAnswer(false)" v-bind:class="ans[1]" class="text-white  focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none dark:focus:ring-blue-800">False</button>
            <!-- <button @click="reveal=''" type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-s-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                True
            </button>
            <button @click="reveal=''" type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded-e-lg hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                False
            </button> -->
            </div>
            <div v-bind:class="reveal">
                <h1 class="text-white text-2xl my-8">Answer: {{ pick["e"] }}</h1>
                
                <h1 class="py-2 text-white">Score: {{ points }}</h1>
                <button @click="complete='hidden'" type="button" class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900">Proceed</button>
                <!-- <button @click="complete='hidden'" type="button" class="px-4 py-2 text-sm font-medium text-gray-900 bg-transparent border border-gray-900 rounded hover:bg-gray-900 hover:text-white focus:z-10 focus:ring-2 focus:ring-gray-500 focus:bg-gray-900 focus:text-white dark:border-white dark:text-white dark:hover:text-white dark:hover:bg-gray-700 dark:focus:bg-gray-700">
                    Proceed
                </button> -->
            </div>
        </div>
    </div>
    </div>
</template>