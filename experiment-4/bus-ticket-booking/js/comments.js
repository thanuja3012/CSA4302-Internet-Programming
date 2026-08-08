/* Comments module for posting and viewing reviews */
const commentForm = document.getElementById('commentForm');
const commentBus = document.getElementById('commentBus');
const commentRating = document.getElementById('commentRating');
const commentText = document.getElementById('commentText');
const commentList = document.getElementById('commentList');
const commentMessage = document.getElementById('commentMessage');

function renderCommentFormOptions() {
  const buses = getData(STORAGE_KEYS.buses);
  commentBus.innerHTML = `<option value="">Select Bus</option>` + buses.map(bus => `<option value="${bus.id}">${bus.name} (${bus.source} → ${bus.destination})</option>`).join('');
}

function renderComments() {
  const comments = getData(STORAGE_KEYS.comments);
  if (!comments.length) {
    commentList.innerHTML = '<div class="alert alert-info">No comments posted yet. Share your travel review.</div>';
    return;
  }
  commentList.innerHTML = comments.map(comment => `
    <div class="card comment-card mb-3">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <div>
            <h6 class="mb-1">${comment.userName}</h6>
            <small class="text-muted">${formatDate(comment.date)}</small>
          </div>
          <span class="badge bg-primary">${comment.rating} / 5</span>
        </div>
        <p class="mb-1"><strong>${comment.busName}</strong></p>
        <p class="text-muted">${comment.comment}</p>
      </div>
    </div>
  `).join('');
}

function submitComment(event) {
  event.preventDefault();
  if (!commentBus.value || !commentRating.value || !commentText.value.trim()) {
    showAlert(commentMessage, 'Please provide bus, rating, and comment text.', 'danger');
    return;
  }
  const currentUser = getCurrentUser();
  const bus = getData(STORAGE_KEYS.buses).find(b => b.id === commentBus.value);
  if (!bus) return;
  const comments = getData(STORAGE_KEYS.comments);
  comments.push({
    id: `com${Date.now()}`,
    userName: currentUser ? currentUser.fullName : 'Guest User',
    busName: bus.name,
    rating: commentRating.value,
    comment: commentText.value.trim(),
    date: new Date().toISOString()
  });
  setData(STORAGE_KEYS.comments, comments);
  showAlert(commentMessage, 'Comment submitted successfully.', 'success');
  commentForm.reset();
  renderComments();
}

window.addEventListener('DOMContentLoaded', () => {
  if (commentForm) {
    renderCommentFormOptions();
    renderComments();
    commentForm.addEventListener('submit', submitComment);
  }
});