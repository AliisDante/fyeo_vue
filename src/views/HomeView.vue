<template>
  <main>
    <!-- <div class="intro">
      <div class="intro-text h-full w-full text-center text-white p-12">
      <h2 class="font-nasalization text-5xl mb-1">For Your Eyes Only</h2>
      <p>Secure cloud storage that focuses on data security.</p>
      </div>
      </div> -->
    <div class="intro min-h-screen bg-red-600 flex w-full flex-col justify-center items-center">
      <div class="intro-text mb-10 text-center text-white">
        <h2 class="intro-title font-nasalization text-5xl">FOR YOUR EYES ONLY</h2>
        <p class="italic">Cloud storage that protects your data. At last.</p>
      </div>
      <RouterLink to="/login">
        <button
          class="rounded-sm bg-white px-6 py-2.5 font-nasalization font-bold text-red-600 text-2xl shadow-sm shadow-gray-700 transition-shadow hover:shadow-md"
        >
          Start Now »
        </button>
      </RouterLink>
    </div>
    <!-- <video src="/src/assets/technology.mp4" autoplay loop class="intro-video"></video> -->
  </main>
</template>

<style scoped>
/* .intro {
   height: calc(100vh - 5rem);
   background-image: url("/src/assets/technology.jpg");
   background-size: cover;
}

.intro-text {
  background: linear-gradient(to right, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0));
} */

@keyframes glowing_words {
  from {
    text-shadow: 0px 2px 8px rgba(255, 255, 255, 0.5);
  }

  to {
    text-shadow: 0px 2px 8px rgba(255, 255, 255, 0.9);
  }
}

.intro-title {
  animation-name: glowing_words;
  animation-duration: 1s;
  animation-direction: alternate;
  animation-iteration-count: infinite;
}
</style>
