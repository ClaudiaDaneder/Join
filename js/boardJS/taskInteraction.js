function findTaskById(taskId) {
    return allTasks.find(
      (element) => parseInt(element["task-id"]) === parseInt(taskId)
    );
  }
  
  
  function openCurrentTask(taskId) {
    const { modalOverlay, modulWindow } = initializeDomElements();
    modalOverlay.style.display = "block";
    modulWindow.innerHTML = "";
  
    const task = findTaskById(taskId);
    if (!task) {
      handleNoTaskFound();
      return;
    }
    currentSubTasks = task["subtasks"];
    const subTasksHtml = createSubtasksHtml(task["subtasks"]);
    const assigneeHtml = createAssigneeHtml(task["assignee-infos"]);
    modulWindow.innerHTML = generateTaskHtml(task, assigneeHtml, subTasksHtml);
  }
  
  function initializeDomElements() {
    const modalOverlay = document.getElementById("modal-overlay");
    const modulWindow = document.getElementById("modal-window");
    return { modalOverlay, modulWindow };
  }
  
  
document.addEventListener("DOMContentLoaded", (event) => {
  let modalWindow = document.getElementById("modal-window");
  if (modalWindow) {
    // Event-Listener, der das Klick-Ereignis abfängt
    modalWindow.addEventListener("click", function (event) {
      // Verhindert, dass das Klick-Ereignis zum modal-overlay propagiert wird
      event.stopPropagation();
    });
  }
});


  function changeSubBox(i) {
    var checkBox = document.getElementById("checkBox_" + i);
    if (checkBox) {
      if (currentSubTasks[i].done) {
        checkBox.src = "./img/none-checked.png";
        currentSubTasks[i].done = false; // Aktualisieren von done auf false
      } else {
        checkBox.src = "./img/checked.png";
        currentSubTasks[i].done = true; // Aktualisieren von done auf true
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
    for (let i = 0; i < allTasks.length; i++) {
      if (allTasks[i]["task-id"] === taskId) {
        foundIndex = i;
        break;
      }
    }
    if (foundIndex !== -1) {
      allTasks.splice(foundIndex, 1);
      await setItem("allTasks", allTasks);
      console.log(`Task mit ID ${taskId} wurde gelöscht.`);
    } else {
      console.log(`Task mit ID ${taskId} nicht gefunden.`);
    }
    closeCurrentTask();
    await init();
  }
  
  
  function editTask() { }
  
  