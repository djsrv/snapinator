import Snapinator from './Snapinator';

const input = document.getElementById('input');
input.addEventListener('input', onFileInput);

function onFileInput() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', async (e) => {
        const project = await Snapinator.readProject(reader.result as ArrayBuffer);
        console.log(project);
    });
    reader.readAsArrayBuffer(file);
}
