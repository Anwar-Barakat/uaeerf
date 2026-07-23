CREATE TABLE UserProfile (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    FullName NVARCHAR(255) NOT NULL,
    MobileNumber NVARCHAR(50),
    City NVARCHAR(100),
    Country NVARCHAR(3),
    RegistrationDate DATETIME DEFAULT GETDATE(),
    Status NVARCHAR(50) DEFAULT 'Active',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE ClassEntriesWeb (
    EntryID INT IDENTITY(1,1) PRIMARY KEY,
    RiderID INT NOT NULL,
    HorseID INT NOT NULL,
    EventID INT NOT NULL,
    ClassID INT NOT NULL,
    EventName NVARCHAR(255) NOT NULL,
    EntryDate DATETIME DEFAULT GETDATE(),
    PaymentStatus NVARCHAR(50) DEFAULT 'Pending',
    PaymentReference NVARCHAR(100),
    Amount DECIMAL(10,2),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE INDEX IX_UserProfile_Email ON UserProfile(Email);
CREATE INDEX IX_ClassEntriesWeb_RiderID ON ClassEntriesWeb(RiderID);
CREATE INDEX IX_ClassEntriesWeb_EventID ON ClassEntriesWeb(EventID);
