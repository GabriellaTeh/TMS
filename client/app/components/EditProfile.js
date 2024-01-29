import React, { useEffect } from "react";

function EditProfile() {
  return (
    <>
      <div class="container py-md-5">
        <div class="row align-items-center">
          <div class="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <h2>My Details</h2>
          </div>
          <div class="col-lg-5 pl-lg-5 pb-3 py-lg-5">
            <h2>Update Details</h2>
            <form>
              <div class="form-group">
                <label for="username-register" class="text-muted mb-1">
                  <small>New email</small>
                </label>
                <input
                  class="form-control"
                  type="text"
                  placeholder="New email"
                  autocomplete="off"
                />
              </div>
              <div class="form-group">
                <label for="email-register" class="text-muted mb-1">
                  <small>New Password</small>
                </label>
                <input
                  class="form-control"
                  type="password"
                  placeholder="New password"
                  autocomplete="off"
                />
              </div>
              <button
                type="submit"
                class="py-3 mt-4 btn btn-lg btn-success btn-block"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProfile;
