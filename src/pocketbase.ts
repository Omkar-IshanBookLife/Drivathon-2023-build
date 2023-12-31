import Pocketbase from "pocketbase"
import { writable } from "svelte/store"

export const pb = new Pocketbase("https://drivathon.pockethost.io/")

export const currentUser = writable(pb.authStore.model)

export let loading = writable(false);

pb.authStore.onChange((auth) => {
    console.log("authStore changed", auth)
    currentUser.set(pb.authStore.model)
})