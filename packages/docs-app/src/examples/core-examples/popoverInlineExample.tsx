/*
 * Copyright 2017 Palantir Technologies, Inc. All rights reserved.
 *
 * Licensed under the terms of the LICENSE file distributed with this project.
 */

import * as React from "react";

import { Button, IPopoverProps, Popover, Position } from "@blueprintjs/core";
import { BaseExample } from "@blueprintjs/docs";

export interface IPopoverInlineExampleState {
    hasMounted?: boolean;
}

export class PopoverInlineExample extends BaseExample<IPopoverInlineExampleState> {
    public state: IPopoverInlineExampleState = {
        hasMounted: false,
    };

    protected className = "docs-popover-inline-example";

    private scrollContainer1Ref: HTMLDivElement;
    private scrollContainer2Ref: HTMLDivElement;
    private refHandlers = {
        scrollContainer1: (ref: HTMLDivElement) => (this.scrollContainer1Ref = ref),
        scrollContainer2: (ref: HTMLDivElement) => (this.scrollContainer2Ref = ref),
    };

    public componentDidMount() {
        // if we don't requestAnimationFrame, this function apparently executes
        // before styles are applied to the page, so the centering is way off.
        requestAnimationFrame(this.recenter);
        // likewise, Popper.js doesn't handle controlled, non-inline popovers
        // properly if rendered with isOpen={true} on initial mount: popovers
        // won't follow the target when scrolled. to fix, defer opening.
        requestAnimationFrame(() => {
            this.setState({ hasMounted: true });
        });
    }

    protected renderExample() {
        const popoverBaseProps: IPopoverProps = {
            enforceFocus: false,
            // set to true after the initial mount, because Popper.js's
            // `keepTogether` functionality apparently doesn't work once you
            // render an open popover in a portal on mount.
            isOpen: this.state.hasMounted ? true : false,
            // prevent-overflow functionality is irrelevant to this example
            modifiers: { preventOverflow: { enabled: false } },
            popoverClassName: "docs-popover-inline-example-popover",
            position: Position.BOTTOM,
        };

        return (
            <div className="docs-popover-inline-example-content">
                <div
                    className="docs-popover-inline-example-scroll-container"
                    ref={this.refHandlers.scrollContainer1}
                    onScroll={this.syncScroll1}
                >
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover {...popoverBaseProps} content="I am a default popover." inline={false}>
                            <Button>
                                <code>{`inline={false}`}</code>
                            </Button>
                        </Popover>
                    </div>
                </div>
                <div
                    className="docs-popover-inline-example-scroll-container"
                    ref={this.refHandlers.scrollContainer2}
                    onScroll={this.syncScroll2}
                >
                    <div className="docs-popover-inline-example-scroll-content">
                        <Popover {...popoverBaseProps} content="I am an inline popover." inline={true}>
                            <Button>
                                <code>{`inline={true}`}</code>
                            </Button>
                        </Popover>
                    </div>
                </div>
            </div>
        );
    }

    protected renderOptions() {
        return [
            [
                <Button
                    key="recenter"
                    text="Re-center"
                    iconName="pt-icon-alignment-vertical-center"
                    onClick={this.recenter}
                />,
            ],
        ];
    }

    private recenter = () => {
        this.scrollToCenter(this.scrollContainer1Ref);
        this.scrollToCenter(this.scrollContainer2Ref);
    };

    private scrollToCenter = (scrollContainer?: HTMLDivElement) => {
        if (scrollContainer != null) {
            const contentWidth = scrollContainer.children[0].clientWidth;
            scrollContainer.scrollLeft = contentWidth / 4;
        }
    };

    private syncScroll1 = () => {
        // use rAF to throttle scroll-sync calculations; otherwise, scrolling is noticeably choppy.
        return requestAnimationFrame(() => this.syncScroll(this.scrollContainer1Ref, this.scrollContainer2Ref));
    };

    private syncScroll2 = () => {
        return requestAnimationFrame(() => this.syncScroll(this.scrollContainer2Ref, this.scrollContainer1Ref));
    };

    private syncScroll(sourceContainer: HTMLDivElement, otherContainer: HTMLDivElement) {
        if (sourceContainer != null && otherContainer != null) {
            otherContainer.scrollLeft = sourceContainer.scrollLeft;
        }
    }
}
