<template>
  <div class="theme-avator-dropdown">
    <Dropdown @on-click="handleClick">
      <Icon class="icon"
            size="30"
            color="white"
            type="md-color-wand" />
      <DropdownMenu slot="list">
        <DropdownItem name="light">主题：亮色</DropdownItem>
        <DropdownItem name="dark">主题：暗色</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './theme.less'
export default {
  name: 'Theme',
  methods: {
    changeColor (theme) {
      this.$emit('accept-theme-color', theme)
    },
    handleClick (name) {
      switch (name) {
        case 'light': this.changeColor('light')
          break
        case 'dark': this.changeColor('dark')
          break
      }
    }
  }
}
</script>
