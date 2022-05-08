const useOwner = () => {
  const currentUser = localStorage.getItem("userId");

  const isUserOwner = (user) => user?._id === currentUser;

  const isUserIdOwner = (userId) => userId === currentUser;

  return { currentUser, isUserIdOwner, isUserOwner };
};

export default useOwner;
