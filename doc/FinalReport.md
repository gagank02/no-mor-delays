# Final Report
### 1. Changes in the directions of your project

- Our final project provides all the features that we originally proposed, at a high level the direction of the project remained the same as our application analyzes flight delays to help users plan their travels 
- Frontend: design changed from 1 page to 3 pages as it provided a better user experience by sectioning out the various analyses on the application
- Backend: originally planned on Flask, but ended up being on Node.js since it was recommended in the workshop to integrate well with GCP

### 2. What our application achieved or failed to achieve regarding its usefulness

- Our application includes all of the basic functionalities that we intended to accomplish to achieve its usefulness. Users can use our website to view flight delays categorized by airport, city, state, and/or month in order to assess whether or not their particular flight will be delayed in a timely manner. Users can also compare different airports and airlines to determine which one is the most reliable for their travel needs. Additionally, our application ensures its real-time accuracy by allowing users to add or remove data from the database, confirming or disproving the information presented in our application.
- Our group was able to implement a creative component to improve the functionality of our application and it's useless. We included visual representations of where the user is currently retrieving results from, as well as a heatmap. The heatmap summarizes delay information across the country/state (based on user selection) which will help users visualize where the majority of delays would occur.

### 3-4. Changes in original and final design of schema, ER diagram, or table implementations and why these changes were suitable

- Our schema did not change. The only change was adding more primary and foreign keys as required by SQL to ensure all table attributes were uniquely identifiable. 
- The overall structure of the ER diagram and tables remained the same. 
- We got feedback from the TA that another change we could make was to change the destination and origin airport to be their own tables or part of the Airports table rather than include them as attributes of the relationship as we had marked. We chose to stick to our original design since they would functionally perform the same just with slightly different designs. We thought this design would be more intuitive since the relationship between an Airport and Flight Route should define the Origin and Destination Airports. 

### 5-6. Discuss functionalities we added or removed. Why? Explain how you think your advanced database programs complement your application.

- While we upheld most of our initially proposed functionality, there were several triggers implemented whose purpose was to enhance user experience. One of the triggers acted on the login page, prompting users to either pick a new username for their new account or informing users they’ve incorrectly entered their password. Another trigger was used to discard a user’s itineraries upon deletion of their account. While these two triggers served as a primary key constraint and a foreign key constraint, they provided the user messages alerting them of the situation. The final trigger that was added was one that would create a flight route for when a delay was entered on a flight route that was not previously in the flight route table. This would allow users to expand our database by only inserting delays without first having to input flight route details. Based on the original mock-up design in our proposal, our final application featured slightly different functionality. Rather than being able to find the best flight or look at how to delay times fluctuated over time, our application allowed the user to find the most reliable airline, find the most popular airline at an airport, and analyze how reliable a given airport is with the most reliable airline and its average delay. The visual component was also different, now featuring a plot of the average length of delays vs the number of delays by a given airport as opposed to how to delay times fluctuate over time. The transition to an airport-focused analysis of airline delays provided the user with an intuitive and interactive interface that would allow them to select the best flight for a given airport.

### 7. Describe one technical challenge encountered by each team member

***Joy*** - One technical challenge that our team encountered was that we were unable to implement a second advanced query to our stored procedure. We tried to return the most reliable flight destination for our advanced query, as well as a query that is similar to the advanced query we implemented in Stage 3, but the return values were unreasonable and formatted incorrectly. 

***Daniel*** - GCP came with an abundance of challenges when it came to uploading our schema and inputting our data. Creating the dump file was an arduous process, but nothing compared to what it took to upload it into GCP. Each iteration of the code required several minutes of processing and runtime. It is extremely important to ensure that the dump file is well thought through in terms of schema design and contains minimal syntax errors prior to uploading to GCP.

***Lasya*** - Another technical challenge we faced was adding our trigger and stored procedure to GCP so they can interact with our database. These had to be done through the SQL workbench rather than just through an endpoint in the node.js app. The workbench ended up being a good option because it was also helpful for SQL debugging as it had an interactive and responsive compiler. 

***Gagan*** - One technical challenge we encountered was figuring out how to properly retrieve our data from the APIs to our frontend, without making it too slow. We attempted to modify both the frontend and backend to try and remediate this problem but eventually decided that we can use dynamic paging to solve our problem.

### 8. Other changes in the final application compared to the original proposal

- Other than the UI design and enforcing user login, nothing was changed in the final application as compared to the original proposal.

### 9. Future improvements for the application (apart from the interface) 

- We think that our application can improve scalability and latency. Because our database has a large amount of data, using MySQL can have limitations on horizontal scalability. If we incorporate a NoSQL database into our application, we can scale horizontally across multiple nodes. Additionally, since our application requires real-time processing, NoSQL databases can be partially useful because they provide lower latency, or minimal delay that results in the most accurate data presentation.  

### 10. The final division of labor and how we managed teamwork
 
***Gagan*** - Created frontend/UI, as well as visualization component, and connected frontend to backend API. Also edited the final demo video.

***Daniel*** - Set up and initialized our GCP cloud database with all of our data, helped the rest of the team learn how to use the GCP terminal, and helped create and upload the stored procedure and trigger.

***Joy*** - Helped develop the advanced queries and implemented both queries and CRUD operations into our backend APIs.

***Lasya*** - Helped develop the stored procedure and trigger and implement them into our backend APIs. Also helped create the intro for our final video.

Overall, our team communicated very well and was able to properly split up the work to match our individual strengths. We completed our work in a timely manner and even left some buffer time before the due dates for each stage just in case of any last-minute changes. Our strong teamwork and work ethic was the leading factor in creating an awesome final product.
