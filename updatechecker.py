import requests
import docker

# Docker Hub repo details
DOCKER_USERNAME = "mickeydoe"
IMAGE_NAME_1 = "projecttwo_back-end"
IMAGE_NAME_2 = "projecttwo_front-end"

# Function to get the latest image digest from Docker Hub
def get_docker_hub_digest(image_name):
    url = f"https://hub.docker.com/v2/repositories/{DOCKER_USERNAME}/{image_name}/tags/latest"
    response = requests.get(url)
    
    if response.status_code == 200:
        return response.json().get('images', [{}])[0].get('digest')
    else:
        print(f"Error fetching digest for {image_name}: {response.status_code}")
        return None

# Function to get the running container image digest
def get_local_digest(image_name):
    client = docker.from_env()
    try:
        image = client.images.get(f"{DOCKER_USERNAME}/{image_name}:latest")
        return image.attrs['RepoDigests'][0].split("@")[1]
    except docker.errors.ImageNotFound:
        print(f"Local image {image_name} not found.")
        return None

# Function to check for updates
def check_for_updates(image_name):
    hub_digest = get_docker_hub_digest(image_name)
    local_digest = get_local_digest(image_name)

    if hub_digest and local_digest:
        if hub_digest == local_digest:
            print(f"{image_name}: ✅ Up-to-date")
        else:
            print(f"{image_name}: 🔄 Update available!")
    else:
        print(f"Could not verify updates for {image_name}")

# Run the check for both containers
check_for_updates(IMAGE_NAME_1)
check_for_updates(IMAGE_NAME_2)
