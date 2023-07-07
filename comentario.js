class CommentManager {
  constructor() {
    this.comments = JSON.parse(localStorage.getItem("comments")) || [];
    this.commentList = document.getElementById("comment-list");
    this.loadComments();
    document.addEventListener("DOMContentLoaded", this.loadComments.bind(this));
    document.getElementById("add-comment-form").addEventListener("submit", this.handleCommentSubmission.bind(this));
    document.getElementById("search-button").addEventListener("click", this.handleSearch.bind(this));
    this.commentList.addEventListener("click", this.handleCommentListClick.bind(this));
  }

  // Adiciona um comentário na lista de comentários
  addComment(name, comment) {
    var li = document.createElement("li");
    li.innerHTML = "<b>" + name + ":</b> " + comment + " <button class='edit-comment'>Editar</button> <button class='delete-comment'>Excluir</button>";
    this.commentList.appendChild(li);
  }

  // Salva um comentário no localStorage
  saveComment(name, comment) {
    this.comments.push({ name: name, comment: comment });
    localStorage.setItem("comments", JSON.stringify(this.comments));
  }

  // Carrega os comentários do localStorage e exibe na página
  loadComments() {
    this.commentList.innerHTML = "";
    for (var i = 0; i < this.comments.length; i++) {
      var comment = this.comments[i];
      this.addComment(comment.name, comment.comment);
    }
  }

  // Busca comentários pelo nome ou conteúdo e exibe na página
  searchComments(query) {
    var filteredComments = this.comments.filter(function (comment) {
      return comment.name.toLowerCase().includes(query.toLowerCase()) ||
        comment.comment.toLowerCase().includes(query.toLowerCase());
    });
    this.commentList.innerHTML = "";
    for (var i = 0; i < filteredComments.length; i++) {
      var comment = filteredComments[i];
      var name = comment.name;
      var highlightedName = name.replace(new RegExp(query, "gi"), "<span class='highlight'>$&</span>");
      var comment = comment.comment;
      var highlightedComment = comment.replace(new RegExp(query, "gi"), "<span class='highlight'>$&</span>");
      var li = document.createElement("li");
      li.innerHTML = "<b>" + highlightedName + ":</b> " + highlightedComment + " <button class='edit-comment'>Editar</button> <button class='delete-comment'>Excluir</button>";
      this.commentList.appendChild(li);
    }
  }

  // Edita um comentário existente
  editComment(index, newName, newComment) {
    if (index >= 0 && index < this.comments.length) {
      this.comments[index].name = newName;
      this.comments[index].comment = newComment;
      localStorage.setItem("comments", JSON.stringify(this.comments));
      this.loadComments();
    }
  }

  // Exclui um comentário existente
  deleteComment(index) {
    if (index >= 0 && index < this.comments.length) {
      this.comments.splice(index, 1);
      localStorage.setItem("comments", JSON.stringify(this.comments));
      this.loadComments();
    }
  }

  // Manipula o evento de envio de comentário
  handleCommentSubmission(e) {
    e.preventDefault();
    var name = document.getElementById("name").value;
    var comment = document.getElementById("comment").value;
    this.addComment(name, comment);
    this.saveComment(name, comment);
    document.getElementById("name").value = "";
    document.getElementById("comment").value = "";
  }

  // Manipula o evento de busca de comentários
  handleSearch() {
    var query = document.getElementById("search-input").value;
    this.searchComments(query);
  }

  // Manipula o evento de clique na lista de comentários (delegação de eventos)
  handleCommentListClick(e) {
    if (e.target.classList.contains("edit-comment")) {
      var li = e.target.parentNode;
      var index = Array.prototype.indexOf.call(li.parentNode.children, li);
      var name = prompt("Digite o novo nome:", li.firstChild.textContent);
      var comment = prompt("Digite o novo comentário:", li.childNodes[2].textContent);
      this.editComment(index, name, comment);
    } else if (e.target.classList.contains("delete-comment")) {
      var li = e.target.parentNode;
      var index = Array.prototype.indexOf.call(li.parentNode.children, li);
      this.deleteComment(index);
    }
  }
}

// Cria uma instância da classe CommentManager para iniciar o gerenciamento dos comentários
new CommentManager();
document.getElementById("back-button").addEventListener("click", function() {
  window.history.back();
});
