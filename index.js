const { App } = require('@slack/bolt');
const createIssue = require('./create-issue');
const  getJiraCardById  = require('./blocks');

const app = new App({
  token: process.env.token,
  signingSecret: process.env.secrect,
  socketMode: true,
  appToken: process.env.apptoken,
  // Socket Mode doesn't listen on a port, but in case you want your app to respond to OAuth,
  // you still need to listen on some port!
  port: process.env.PORT || 3000
});

const PROJECT_KEY = 'TEST';
// Listens to incoming messages that contain "hello"
app.message( async ({ message, say }) => {
  
    try {
        const issueType = 'Task';
        const summary = message.text;
        const description = '';
        const issueKey = await createIssue(PROJECT_KEY, issueType, summary, description);
        const block = await getJiraCardById(issueKey);
        await say(block);
    } catch (error) {
        await say("Error creating issue: " + error);
    }
  });


//   app.command('/test', async ({ command, ack, say }) => {
//     const issueType = 'Task';
//     const summary = command.text;
//     const description = '';
//     const issueKey = await createIssue('TEST', issueType, summary, description);
//     await ack({"text": "jira was created successfully"});
//   })

  // Listen for a slash command invocation
app.command('/test', async ({ ack, body, client, logger }) => {
    // Acknowledge the command request
  console.log("boby", JSON.stringify(body))
    try {
      // Call views.open with the built-in client
      const result = await client.views.open({
        // Pass a valid trigger_id within 3 seconds of receiving it
        trigger_id: body.trigger_id,
        // View payload
        view: {
            "type": "modal",
            "callback_id": "jira_ticket_modal",
            "title": {
                "type": "plain_text",
                "text": "Create Jira Ticket"
            },
            "submit": {
                "type": "plain_text",
                "text": "Submit"
            },
            "close": {
                "type": "plain_text",
                "text": "Cancel"
            },
            "blocks": [
                {
                    "type": "input",
                    "block_id": "title_block",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "title_input",
                        "initial_value" : `${body.text}`
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Title"
                    }
                },
                {
                    "type": "input",
                    "block_id": "summary_block",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "summary_input"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Summary"
                    }
                },
                // {
                //     "type": "input",
                //     "block_id": "status_block",
                //     "element": {
                //         "type": "static_select",
                //         "action_id": "status_select",
                //         "options": [
                //             {
                //                 "text": {
                //                     "type": "plain_text",
                //                     "text": "To Do"
                //                 },
                //                 "value": "to_do"
                //             },
                //             {
                //                 "text": {
                //                     "type": "plain_text",
                //                     "text": "In Progress"
                //                 },
                //                 "value": "in_progress"
                //             },
                //             {
                //                 "text": {
                //                     "type": "plain_text",
                //                     "text": "Done"
                //                 },
                //                 "value": "done"
                //             }
                //         ]
                //     },
                //     "label": {
                //         "type": "plain_text",
                //         "text": "Status"
                //     }
                // },
                // {
                //     "type": "input",
                //     "block_id": "priority_block",
                //     "element": {
                //         "type": "static_select",
                //         "action_id": "priority_select",
                //         "options": [
                //             {
                //                 "text": {
                //                     "type": "plain_text",
                //                     "text": "Low"
                //                 },
                //                 "value": "low"
                //             },
                //             {
                //                 "text": {
                //                     "type": "plain_text",
                //                     "text": "Medium"
                //                 },
                //                 "value": "medium"
                //             },
                //             {
                //                 "text": {
                //                     "type": "plain_text",
                //                     "text": "High"
                //                 },
                //                 "value": "high"
                //             }
                //         ]
                //     },
                //     "label": {
                //         "type": "plain_text",
                //         "text": "Priority"
                //     }
                // },

            ]
        }
        
      });

      await ack({text : "jira ticket created successfully"});

    }
    catch (error) {
      logger.error(error);
      await ack({text : "error in creating jira ticket"});
    }
  });
  
  // Handle a view_submission request
app.view('jira_ticket_modal', async ({ ack, body, view, client, logger }) => {
    // Acknowledge the view_submission request
    await ack();


    const title = view.state.values.title_block.title_input.value;
    const summary = view.state.values.summary_block.summary_input.value;
    // const status = view.state.values.status_block.status_select.selected_option.value;
    // const priority = view.state.values.priority_block.priority_select.selected_option.value;


    const user = body['user']['id'];

    const issueType = 'Task';
    const issueKey = await createIssue(PROJECT_KEY, issueType, summary, title);
    const block = await getJiraCardById(issueKey);
  
    // Message the user
    try {
      await client.conversations.replies({
        token:  process.env.token ,
        channel: user,
        thread_ts: body['message']['ts'],
        blocks: block
      });
    }
    catch (error) {
      logger.error(error);
    }
  
  });
    
  (async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
  })();

