<template>
    <div class="card">
        <slot name="header">
            <h3 class="card-title">Card Title</h3>
        </slot>
        <div class="card-content">
            <slot>
                Card content goes here.
            </slot>
        </div>
        <slot name="footer"></slot>
    </div>
</template>


<style scoped>
.card {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 16px;
    background: #fff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    max-width: 400px;
}

.card-title {
    margin: 0 0 12px 0;
    font-size: 1.25rem;
    font-weight: 600;
}

.card-content {
    font-size: 1rem;
    color: #374151;
}
</style>