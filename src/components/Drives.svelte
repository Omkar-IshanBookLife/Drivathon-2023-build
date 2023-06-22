<script type="ts">
    import { onMount } from "svelte";
    import { pb, currentUser } from "../pocketbase";

    let drives = [];

    onMount(async () => {
        drives = await pb.collection("campaigns").getFullList({ sort: "-created", expand: "createdUser" })
        console.log(drives)
    })
</script>

<main>
    <h3>All Campaigns or Drives to Join</h3>
    <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Eligendi
        explicabo sunt repellendus laborum architecto perspiciatis omnis, odio
        voluptatibus sequi culpa, iste, molestiae ea praesentium.
    </p>
    <hr>
    <div id="drives">
        {#each drives as drive}
        <div class="card w-50 mb-4">
            <img
                src="https://drivathon.pockethost.io/api/files/campaigns/{drive.id}/{drive.image}"
                class="card-img-top img-fluid"
                alt="tweet-img"
            />
            <div class="card-body">
                <h5>{drive.title}</h5>
                <p>
                    {@html drive.description?.slice(0,300)+"..." }
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
