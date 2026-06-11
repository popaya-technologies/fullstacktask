export default function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div className='confirm-overlay'>
      <div className='confirm-dialog'>
        <p>{message}</p>
        <div className='confirm-actions'>
          <button className='btn btn-danger' onClick={onConfirm}>
            Delete
          </button>
          <button className='btn btn-secondary' onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
