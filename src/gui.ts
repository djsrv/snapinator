import Project from './Project';
import Snapinator from './Snapinator';

const input = document.getElementById('input');
input.addEventListener('input', onFileInput);

function onFileInput() {
    const file = this.files[0];
    const reader = new FileReader();
    reader.addEventListener('load', async (e) => {
        const project = await Snapinator.readProject(reader.result as ArrayBuffer);
        console.log(project);
        if (project instanceof Project) {
            const projectXML = project.toXML().serialize();
            const a = document.createElement('a');
            a.href = URL.createObjectURL(new Blob([projectXML], {type: 'text/xml'}));
            a.download = 'TEST.xml';
            a.textContent = 'Download';
            document.body.appendChild(a);
        }
    });
    reader.readAsArrayBuffer(file);
}
