<script setup>
import { ref } from 'vue'
import ActionBarInclude from "../components/ActionBarInclude.vue"
import UserRow from "../components/UserRow.vue";

console.log(document.getElementsByTagName("iframe"))
let x = document.getElementsByTagName("iframe");
// x.innerHTML = x.innerHTML.replace(result,"<b>" + search + "</b>" ); 
</script>

<template>
    <ActionBarInclude>
        <div class="grid grid-cols-3">
            <div class="w-full p-4 h-screen col-span-2">
                <iframe class="border-2 border-black w-full p-4 h-screen" src="http://localhost:5173/report.txt"></iframe>
            </div>
            <div class="w-full p-4 h-screen">
                <h2 class="text-2xl text-red-800 font-nasalization font-bold">Audit Summary</h2>
                <h3>Total Packages: 260</h3>
                <h3>Vulnerable Packages: 1</h3>
                
                <h2 class="text-2xl text-red-800 font-nasalization font-bold mt-10">Navigation Tools</h2>
                <a>
                    <button class="text-white bg-gradient-to-r from-red-400 via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 my-5" @click="z=x[0].contentDocument;y=x[0].contentDocument.body;console.log(y);y.innerHTML = y.innerHTML.replace(/Vulnerability Title/g,'<b id=\'vuln0\'>Vulnerability Title</b>' );z.getElementById('vuln0').scrollIntoView();">Jump To Vulnerable Package</button>
                </a>
            </div>
        </div>
    </ActionBarInclude>
</template>