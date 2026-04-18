<script lang="ts">
    let { label, value = $bindable(""), id, type, placeholder = "" }: { label: string, value: string, id: string, type: string, placeholder?: string } = $props();
</script>
<p class="font-medium text-xs text-zinc-600 mt-1.5 pl-1">{label}</p>
<div class="flex-[0_0_3rem] w-full flex justify-center items-center border-2 border-zinc-200 rounded-md focus-within:border-zinc-800 transition-colors duration-300">
    <input bind:value={value} id={id} type={type} placeholder={placeholder} autocomplete="off"
        class="flex-[1_1_auto] min-w-0 py-2 pl-2 h-full text-sm truncate text-zinc-800 placeholder-zinc-400 outline-none">
</div>