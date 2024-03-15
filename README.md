# Avo::DynamicFilters
The dynamic filters feature for Avo.

# Release process

To release to the github repository. You need to do a few things.

1. Increment the version number
2. Build the gem
3. Push to GitHub

```bash
bump minor
rake app:avo-dynamic_filters:build
rake app:avo-dynamic_filters:push
```

