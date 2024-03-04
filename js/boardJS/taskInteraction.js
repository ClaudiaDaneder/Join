function findTaskById(taskId) {
    return allDownloadTasks.find(
      (element) => parseInt(element["task-id"]) === parseInt(taskId)
    );
  }
  
  
  async function openCurrentTask(taskId) {
    const { modalOverlay, modulWindow } = initializeDomElements();
    modalOverlay.style.display = "flex";
    modulWindow.innerHTML = "";
  
    const task = findTaskById(taskId);
    if (!task) {
      handleNoTaskFound();
      return;
    }
    currentSubTasks = task["subtasks"];
    const subTasksHtml = createSubtasksHtml(task["subtasks"]);
    const assigneeHtml = createAssigneeHtml(task["assignee-infos"]);
    const editAssigneeHtml= editAssignee(task["assignee-infos"]);
    modulWindow.innerHTML = await generateTaskHtml(task, assigneeHtml, subTasksHtml,editAssigneeHtml);
    

    document.getElementById('urgent').addEventListener('click', () => updatePriority('urgent', task));
    document.getElementById('medium').addEventListener('click', () => updatePriority('medium', task));
    document.getElementById('low').addEventListener('click', () => updatePriority('low', task));
  }
  

  function initializeDomElements() {
    const modalOverlay = document.getElementById("modal-overlay");
    const modulWindow = document.getElementById("modal-window");
    return { modalOverlay, modulWindow };
  }
  
  
document.addEventListener("DOMContentLoaded", (event) => {
  let modalWindow = document.getElementById("modal-window");
  if (modalWindow) {
    modalWindow.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  }
});


  function changeSubBox(i) {
    var checkBox = document.getElementById("checkBox_" + i);
    if (checkBox) {
      if (currentSubTasks[i].done) {
        checkBox.src = "./img/none-checked.png";
        currentSubTasks[i].done = false;
      } else {
        checkBox.src = "./img/checked.png";
        currentSubTasks[i].done = true;
      }
    }
    upDateAllDate();
  }
  
  
  function closeCurrentTask() {
    let modalOverlay = document.getElementById("modal-overlay");
    modalOverlay.style.display = "none";
  }
  
  
  async function deletThisArray(taskId) {
    let foundIndex = -1;
    for (let i = 0; i < allDownloadTasks.length; i++) {
      if (allDownloadTasks[i]["task-id"] === taskId) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex !== -1) {
      allDownloadTasks.splice(foundIndex, 1);
      await setItem("allTasks", allDownloadTasks);
      console.log(`Task mit ID ${taskId} wurde gelöscht.`);
    } else {
      console.log(`Task mit ID ${taskId} nicht gefunden.`);
    }
    closeCurrentTask();
    await init();
  }
 
  
  