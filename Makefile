permissions:
	@echo "Generating permissions.sqlite..."
	test -d profile || mkdir -p profile
	@$(call run-js-command, permissions)
	@echo "Done."
