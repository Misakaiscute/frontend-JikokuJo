<script lang="ts">
    import UserController from "./userController.svelte.ts";
    import Login from "./auth/Login.svelte";
    import Register from "./auth/Register.svelte";
    import AccountPanel from "./account/AccountPanel.svelte";

    const userController = UserController.getUserControllerContext();

    const onLoginBtnClick = (): void => { userController.popupShown = "login"; }
    const onRegisterBtnClick = (): void => { userController.popupShown = "register"; }
    const onAccountBtnClick = (): void => { userController.popupShown = "account"; }
</script>

{#snippet loginBtn()}
    <div id="login-btn" role="button" tabindex="0"
        class="flex-[0_0_auto] h-full flex justify-center items-center bg-white border-2 border-zinc-200 rounded-md
               pointer-events-auto hover:cursor-pointer hover:border-zinc-800 transition-all duration-200"
        onclick={onLoginBtnClick} onkeydown={() => {}}
    >
        <p class="text-sm mx-2">Bejelentkezés</p>
    </div>
{/snippet}
{#snippet registerBtn()}
    <div id="register-btn" role="button" tabindex="0"
        class="flex-[0_0_auto] h-full flex justify-center items-center bg-white border-2 border-zinc-200 rounded-md
               pointer-events-auto hover:cursor-pointer hover:border-zinc-800 transition-all duration-200"
        onclick={onRegisterBtnClick} onkeydown={() => {}}
    >
        <p class="text-sm mx-2">Regisztráció</p>
    </div>
{/snippet}
{#snippet accountBtn()}
    <div id="account-btn" role="button" tabindex="0"
        class="group self-end h-full aspect-square bg-white border-2 border-zinc-200 rounded-full flex justify-center items-center
             hover:border-zinc-800 transition-colors duration-300 pointer-events-auto hover:cursor-pointer"
        onclick={onAccountBtnClick} onkeydown={() => {}}
    >
        <svg xmlns="http://www.w3.org/2000/svg" class="flex-[0_0_80%] aspect-square stroke-zinc-400 group-hover:stroke-zinc-800 transition-colors duration-300" viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="8" r="4"/>
            <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        </svg>
    </div>
{/snippet}

<div class="h-10 w-full flex justify-end items-center gap-1">
    {#await userController.isLoggedIn}
        <div id="loading-shimmer" class="flex-[0_0_100px] h-full  rounded-md pointer-events-auto"></div>
        <div id="loading-shimmer" class="flex-[0_0_100px] h-full rounded-md pointer-events-auto"></div>
    {:then _}
        {@render accountBtn()}
    {:catch _}
        {@render loginBtn()}
        {@render registerBtn()}
    {/await}
    {#if userController.popupShown === "login"}
        <Login/>
    {:else if userController.popupShown === "register"}
        <Register/>
    {:else if userController.popupShown === "account"}
        <AccountPanel/>
    {/if}
</div>