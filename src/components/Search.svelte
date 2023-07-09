<script lang="ts">
    import { onMount } from "svelte";
    import { pb, currentUser, loading } from "../pocketbase";
    
    export let search = "";

    let drives = [];

    onMount(async () => {
        drives = await pb
            .collection("campaigns")
            .getFullList({ sort: "-created", expand: "createdUser", filter: `title~"${search}"` });
        console.log(drives);
    });
</script>

<main>
    <h3>Search Results for: {search}</h3>
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur
        maiores recusandae iure, praesentium molestias, culpa et obcaecati
        excepturi deleniti enim voluptas reiciendis, temporibus cupiditate.
        Laboriosam assumenda sint quas itaque eveniet.
    </p>
    <hr />
    <div id="drives">
        {#each drives as drive}
        <div class="card vw-50 mb-4">
            <img
                src="https://drivathon.pockethost.io/api/files/campaigns/{drive.id}/{drive.image}"
                class="card-img-top img-fluid"
                alt="tweet-img"
            />
            <div class="card-body">
                <h5>{drive.title}</h5>
                <p>
                    {@html drive.description?.slice(0,600)+"..." }
                </p>
                <p>Posted by, {drive.expand?.createdUser?.name}</p>
                <div class="btn-group">
                    <a
                        class="btn btn-primary"
                        href="/drive/{drive.id}">Details</a
                    ><a
                        class="btn btn-secondary"
                        href="{drive.map}"
                        target="_blank"
                        rel="noreferrer">Map</a
                    >
                </div>
            </div>
            <div class="card-footer">
                <p class="text-muted">
                    posted on {drive.created}
                </p>
            </div>
        </div>
        {/each}
    </div>
</main>
