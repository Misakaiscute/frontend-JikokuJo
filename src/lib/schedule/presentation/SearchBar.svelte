<script lang="ts">
    import ScheduleSearchController from "./scheduleSearchController.svelte.ts";

    const scheduleSearchController: ScheduleSearchController = ScheduleSearchController.getScheduleSearchControllerContext();
</script>
<div class="w-full h-20">
    <input
        class="bg-green-100 w-4/5 h-full"
        type="text"
        bind:value={scheduleSearchController.searchString}
        placeholder="Megálló / járat"
    />

</div>