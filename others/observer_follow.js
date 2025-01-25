// Observer Interface (Base class)
class Observer {
    update(data) {
      throw new Error('You have to implement the update method!');
    }
  }
  
  // Concrete Observer: LoggingObserver
  class LoggingObserver extends Observer {
    update(data) {
      console.log(`User ${data.userId} followed doctor ${data.docId}`);
    }
  }
  
  // Concrete Observer: NotificationObserver
  class NotificationObserver extends Observer {
    update(data) {
      // Implement notification logic here, like sending an email or push notification
      console.log(`Sending notification: User ${data.userId} followed doctor ${data.docId}`);
    }
  }
  
  // Subject: FollowDoctor
  class FollowDoctor {
    constructor() {
      this.observers = [];
    }
  
    // Method to add observers
    subscribe(observer) {
      this.observers.push(observer);
    }
  
    // Notify all observers
    notify(data) {
      this.observers.forEach(observer => observer.update(data));
    }
  
    // Follow doctor logic
    async follow(docId, userId, doctorModel) {
      try {
        const doctor = await doctorModel.findById(docId);
        if (!doctor) {
          throw new Error("Doctor not found");
        }
  
        if (doctor.followers.includes(userId)) {
          throw new Error("Already following this doctor");
        }
  
        // Add user to the doctor's followers list
        doctor.followers.push(userId);
        await doctor.save();
  
        // Notify all subscribers (observers)
        this.notify({ userId, docId });
  
        return { success: true, message: "Successfully followed the doctor" };
      } catch (error) {
        throw new Error(error.message);
      }
    }
  }
  
  // API Controller
  const followDoctor = async (req, res) => {
    try {
      console.log("Request body:", req.body);
      const { docId, userId } = req.body;
  
      // Create the FollowDoctor object (the Subject)
      const followDoctorAction = new FollowDoctor();
  
      // Create observers (Logging and Notification)
      const loggingObserver = new LoggingObserver();
      const notificationObserver = new NotificationObserver();
  
      // Subscribe observers to the FollowDoctor subject
      followDoctorAction.subscribe(loggingObserver);
      followDoctorAction.subscribe(notificationObserver);
  
      // Execute the follow logic
      const result = await followDoctorAction.follow(docId, userId, doctorModel);
  
      // Return response
      res.json(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ success: false, message: error.message });
    }
  };
  