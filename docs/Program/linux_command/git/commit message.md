<h1 align="center">commit message</h1>




Another important thing to keep in mind is that your commit message should have a blank line between the summary and description. If you omit this empty line, you will see some weird behaviour:
- The subject of the email to llvm-commits will contain the entire text of the message
- Your review will likely not be closed automatically
- The text will show up on a single line in the console (http://lab.llvm.org:8011/console)
- Probably other issues with confused automation





And some more general tips about commit message https://chris.beams.io/posts/git-commit/
* Separate subject from body with a blank line
* Limit the subject line to 50 characters
* Capitalize the subject line
* Do not end the subject line with a period
* Use the imperative mood in the subject line
* Wrap the body at 72 characters
* Use the body to explain what and why vs. how