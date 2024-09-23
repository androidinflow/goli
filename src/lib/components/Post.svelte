<script>
    import { Motion, useMotionTemplate, useMotionValue } from "svelte-motion";
    import { createEventDispatcher } from 'svelte';
    
    export let title = "Luxe";
    export let description = "Library of dark mode components to illuminate your applications with elegance and sophistication.";
    export let imageUrl = "https://i.pinimg.com/564x/c3/5c/30/c35c30d5bb21d2392c3daa0abd8a5440.jpg";
    export let buttonText = "Sponsor Now";

    let mouseX = useMotionValue(0);
    let mouseY = useMotionValue(0);
    let background = useMotionTemplate`radial-gradient(200px circle at ${mouseX}px ${mouseY}px, rgba(51, 51, 51, 0.4), transparent 80%)`;

    const dispatch = createEventDispatcher();

    function handleClick() {
        dispatch('click');
    }
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    on:mousemove={(e) => {
      const { left, top } = e.currentTarget.getBoundingClientRect();
  
      mouseX.set(e.clientX - left);
      mouseY.set(e.clientY - top);
    }}
    class="group relative w-full overflow-hidden rounded-xl bg-base-300"
>
    <div
      class="absolute right-5 top-0 h-px w-80 bg-gradient-to-l from-transparent via-base-content/30 via-10% to-transparent"
    />
    <Motion
      style={{
        background,
      }}
      let:motion
    >
      <div
        use:motion
        class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
      ></div>
    </Motion>
    <div
      class="relative flex flex-col h-full rounded-xl border border-base-content/10 px-4 py-5"
    >
      <div class="flex flex-col h-full">
        <!-- svelte-ignore a11y-img-redundant-alt -->
        <img
          src={imageUrl}
          alt="Product image"
          height={10}
          width={10}
          class="rounded-xl h-52 w-full object-cover"
        />
        <div class="flex flex-row items-center justify-between pt-2">
          <h3 class="text-xl font-semibold text-base-content">{title}</h3>
        </div>
        <p class="text-sm leading-[1.5] text-base-content/70 flex-grow">
          {description}
        </p>
        <button
          on:click={handleClick}
          class="btn btn-primary w-full mt-3"
        >
          {buttonText}
        </button>   
      </div>
    </div>
  </div>
